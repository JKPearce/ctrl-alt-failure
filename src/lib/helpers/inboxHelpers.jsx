import {
  COMPLAINT_TEMPLATES,
  SPAM_TEMPLATES,
  TICKET_TEMPLATES,
} from "@/lib/data/inboxTemplates";
import { nanoid } from "nanoid";

// Calculate how many items to spawn based on day number and chaos
export function calculateItemsToSpawn(dayNumber, chaos) {
  // Base items per day (starts low, grows over time)
  const baseItems = Math.max(4, Math.floor(dayNumber * 0.8));

  // Chaos multiplier (1.0 = normal, 2.0 = double items at max chaos)
  const chaosMultiplier = 1 + chaos / 100;

  // Calculate total items
  const totalItems = Math.ceil(baseItems * chaosMultiplier);

  console.log(
    `Day ${dayNumber}, Chaos ${chaos}: ${baseItems} base × ${chaosMultiplier.toFixed(
      2
    )} chaos = ${totalItems} total`
  );

  return totalItems;
}

export async function spawnInboxItems({
  chaos,
  contract,
  totalItems = 1,
  gameMinutes = 0,
  dayNumber = 1,
}) {
  const itemDescriptors = [];
  for (let i = 0; i < totalItems; i++) {
    const type = pickType(chaos);
    const descriptor = {
      id: nanoid(),
      type,
    };

    if (type === "ticket") {
      descriptor.source = Math.random() < 0.8 ? "api" : "cached";
    } else if (type === "spam") {
      descriptor.source = Math.random() < 0.5 ? "api" : "cached";
    } else {
      descriptor.source = "cached"; // complaints are always cached
    }

    itemDescriptors.push(descriptor);
  }

  const apiTicketCount = itemDescriptors.filter(
    (item) => item.type === "ticket" && item.source === "api"
  ).length;

  const apiSpamCount = itemDescriptors.filter(
    (item) => item.type === "spam" && item.source === "api"
  ).length;

  // Make API calls in parallel
  const apiTicketPromises = Array(apiTicketCount)
    .fill(null)
    .map(() =>
      fetch("/api/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract, chaos }),
      })
        .then((res) => res.json())
        .catch(() => null)
    );

  const apiSpamPromises = Array(apiSpamCount)
    .fill(null)
    .map(() =>
      fetch("/api/spam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract, chaos }),
      })
        .then((res) => res.json())
        .catch(() => null)
    );

  const [apiTicketResults, apiSpamResults] = await Promise.all([
    Promise.all(apiTicketPromises),
    Promise.all(apiSpamPromises),
  ]);

  let ticketApiIndex = 0;
  let spamApiIndex = 0;

  const items = {};
  for (const descriptor of itemDescriptors) {
    let itemData;

    // For tickets, check if source is API - if so, use next API result (or fallback if API failed)
    // If not API source, just use a fallback template. Increment API index counter after using result.
    if (descriptor.type === "ticket") {
      itemData =
        descriptor.source === "api"
          ? apiTicketResults[ticketApiIndex++] ||
            getFallbackTicket(TICKET_TEMPLATES)
          : getFallbackTicket(TICKET_TEMPLATES);
    }
    if (descriptor.type === "spam") {
      itemData =
        descriptor.source === "api"
          ? apiSpamResults[spamApiIndex++] || getFallbackTicket(SPAM_TEMPLATES)
          : getFallbackTicket(SPAM_TEMPLATES);
    }
    if (descriptor.type === "complaint") {
      itemData = getFallbackTicket(COMPLAINT_TEMPLATES);
    }

    items[descriptor.id] = {
      id: descriptor.id,
      messageType: descriptor.type,
      ...itemData,
      // ... other properties
      receivedDay: dayNumber,
      receivedTime: gameMinutes,
      activeItem: true,
      resolved: false,
      failCount: 0,
      agentAssigned: null,
      resolveProgress: 0,
      timeToResolve: 100,
    };
  }

  return items;
}

function pickType(chaos) {
  // weights: tickets = 1, spam = chaos/10, complaint = openComplaints * 0.5
  const spamWeight = chaos / 10;
  const ticketWeight = 1;
  const total = spamWeight + ticketWeight;

  const roll = Math.random() * total;
  if (roll < ticketWeight) return "ticket";
  return "spam";
}

function getFallbackTicket(template) {
  return template[Math.floor(Math.random() * template.length)];
}

export function progressAndResolveTickets(inbox, nextTick, currentDay, agents) {
  return Object.fromEntries(
    Object.entries(inbox).map(([id, ticket]) => {
      // only bump progress for assigned tickets
      if (!ticket.agentAssigned) return [id, ticket];

      //if the agent isnt set to "WORKING" then we dont want to progress the ticket
      if (agents[ticket.agentAssigned].currentAction !== "WORKING") {
        return [id, ticket];
      }

      const progress = ticket.resolveProgress + 1;
      if (progress >= ticket.timeToResolve) {
        // resolved
        return [
          id,
          {
            ...ticket,
            activeItem: false,
            agentAssigned: null,
            resolved: true,
            resolvedOnDay: currentDay,
            resolvedOnTick: nextTick,
            resolveProgress: 0,
            resolvedBy: ticket.agentAssigned,
            resolutionNotes: ticket.resolutionNotes,
          },
        ];
      }

      // ticket is still in progress
      return [
        id,
        {
          ...ticket,
          resolveProgress: Number(progress),
        },
      ];
    })
  );
}
