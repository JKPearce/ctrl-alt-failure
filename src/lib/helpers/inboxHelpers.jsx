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
  const itemTypes = [];
  let apiTicketCount = 0;
  const ticketSources = [];

  // Determine item types and sources upfront
  for (let i = 0; i < totalItems; i++) {
    const type = pickType(chaos);
    itemTypes.push(type);

    if (type === "ticket") {
      const source = Math.random() < 0.8 ? "api" : "cached";
      ticketSources.push(source);
      if (source === "api") apiTicketCount++;
    }
  }

  // Make API calls in parallel
  const apiPromises = Array(apiTicketCount)
    .fill(null)
    .map(async () => {
      try {
        const response = await fetch("/api/ticket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contract }),
        });
        console.log("response", response);
        return response.json();
      } catch (error) {
        console.warn("API call failed:", error);
        return null;
      }
    });

  const apiResults = await Promise.all(apiPromises);
  const items = {};

  let apiIndex = 0;
  let ticketSourceIndex = 0;

  // Generate inbox items
  for (let i = 0; i < totalItems; i++) {
    const type = itemTypes[i];
    const id = nanoid();
    let itemData;

    if (type === "ticket") {
      const source = ticketSources[ticketSourceIndex++];

      if (source === "api") {
        itemData =
          apiResults[apiIndex++] || getFallbackTicket(TICKET_TEMPLATES);
      } else {
        itemData = getFallbackTicket(TICKET_TEMPLATES);
      }

      // Validate ticket data
      if (!itemData?.body || !itemData?.sender) {
        console.warn("Invalid ticket data, using fallback");
        itemData = getFallbackTicket(TICKET_TEMPLATES);
      }
    } else {
      itemData = await pickTemplate(type, contract);
    }

    items[id] = {
      id,
      messageType: type,
      ...itemData,
      receivedDay: dayNumber,
      receivedTime: gameMinutes,
      activeItem: true,
      resolved: false,
      failCount: 0,
      agentAssigned: null,
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

async function pickTemplate(type, contract) {
  switch (type) {
    case "ticket":
      const apiOrCached = Math.random() < 0.5 ? "api" : "cached";
      console.log("apiOrCached ", apiOrCached);
      if (apiOrCached === "cached") {
        return getFallbackTicket(TICKET_TEMPLATES);
      } else {
        try {
          const ticket = await fetch("/api/ticket", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contract,
            }),
          });
          const ticketData = await ticket.json();
          console.log("ticketData", ticketData);
          return ticketData;
        } catch (error) {
          console.error("Error fetching ticket:", error);
          return getFallbackTicket(TICKET_TEMPLATES);
        }
      }

    case "complaint":
      return getFallbackTicket(COMPLAINT_TEMPLATES);
    default:
      return SPAM_TEMPLATES[Math.floor(Math.random() * SPAM_TEMPLATES.length)];
  }
}

function getFallbackTicket(template) {
  return template[Math.floor(Math.random() * template.length)];
}
