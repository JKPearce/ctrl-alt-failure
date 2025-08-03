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

export const checkAndSpawnComplaint = async (
  ticket,
  agent,
  dayNumber,
  gameMinutes,
  chaos
) => {
  let chance = 0.1; // Base 10% chance

  // Agent skill vs ticket difficulty
  if (agent.skills[ticket.ticketType] < ticket.difficulty) chance += 0.2;

  // How long ticket took
  if (ticket.timeToResolve > 100) chance += 0.15;

  // Current chaos level
  chance += chaos * 0.01;

  if (Math.random() < chance) {
    return await spawnNewComplaint(ticket, agent, dayNumber, gameMinutes);
  }

  return null;
};

export async function spawnInboxItems({
  totalItems = 1,
  chaos,
  contract,
  dayNumber,
  gameMinutes,
}) {
  // Calculate what types of items to spawn
  const itemTypes = calculateItemTypes(totalItems, chaos);

  // Spawn all items in parallel
  const spawnPromises = [];

  // Spawn tickets
  for (let i = 0; i < itemTypes.tickets; i++) {
    spawnPromises.push(spawnNewTicket(contract, chaos, dayNumber, gameMinutes));
  }

  // Spawn spam
  for (let i = 0; i < itemTypes.spam; i++) {
    spawnPromises.push(spawnNewSpam(contract, chaos, dayNumber, gameMinutes));
  }

  // Wait for all items to spawn
  const spawnedItems = await Promise.all(spawnPromises);

  // Convert array to object with IDs as keys
  const items = {};
  spawnedItems.forEach((item) => {
    items[item.id] = item;
  });

  return items;
}

// Helper function to calculate item distribution
const calculateItemTypes = (totalItems, chaos) => {
  const spamWeight = chaos / 10;
  const ticketWeight = 1;
  const totalWeight = spamWeight + ticketWeight;

  const tickets = Math.floor((ticketWeight / totalWeight) * totalItems);
  const spam = totalItems - tickets;

  return { tickets, spam };
};

// Individual spawn functions (simplified)
export const spawnNewTicket = async (
  contract,
  chaos,
  dayNumber,
  gameMinutes
) => {
  const shouldUseAPI = Math.random() < 0.5;

  let ticketData;
  if (shouldUseAPI) {
    try {
      const response = await fetch("/api/ticket", {
        method: "POST",
        body: JSON.stringify({ contract }),
      });
      ticketData = await response.json();
    } catch (error) {
      ticketData = getFallbackTicket(TICKET_TEMPLATES);
    }
  } else {
    ticketData = getFallbackTicket(TICKET_TEMPLATES);
  }

  return {
    id: nanoid(),
    messageType: "ticket",
    ...ticketData,
    receivedDay: dayNumber,
    receivedTime: gameMinutes,
    activeItem: true,
    resolved: false,
    failCount: 0,
    agentAssigned: null,
    resolveProgress: 0,
    timeToResolve: 100,
  };
};

export const spawnNewSpam = async (contract, chaos, dayNumber, gameMinutes) => {
  const shouldUseAPI = Math.random() < 0.5;

  let spamData;
  if (shouldUseAPI) {
    try {
      const response = await fetch("/api/spam", {
        method: "POST",
        body: JSON.stringify({ contract }),
      });
      spamData = await response.json();
    } catch (error) {
      spamData = getFallbackTicket(SPAM_TEMPLATES);
    }
  } else {
    spamData = getFallbackTicket(SPAM_TEMPLATES);
  }

  return {
    id: nanoid(),
    messageType: "spam",
    ...spamData,
    receivedDay: dayNumber,
    receivedTime: gameMinutes,
    activeItem: true,
  };
};

export const spawnNewComplaint = async (
  ticket,
  agent,
  dayNumber,
  gameMinutes
) => {
  const shouldUseAPI = Math.random() < 0.8;

  let complaintData;
  if (shouldUseAPI) {
    try {
      const response = await fetch("/api/complaint", {
        method: "POST",
        body: JSON.stringify({ ticket, agent, dayNumber, gameMinutes }),
      });
      complaintData = await response.json();
    } catch (error) {
      complaintData = getFallbackTicket(COMPLAINT_TEMPLATES);
    }
  } else {
    complaintData = getFallbackTicket(COMPLAINT_TEMPLATES);
  }

  return {
    id: nanoid(),
    messageType: "complaint",
    ...complaintData,
    receivedDay: dayNumber,
    receivedTime: gameMinutes,
    activeItem: true,
  };
};
