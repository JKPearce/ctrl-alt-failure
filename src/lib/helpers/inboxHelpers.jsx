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

export const generateNewMessages = (amount, dayNumber) => {
  //eventually this will be an API call to get a unique ticket / message
  const messages = {};

  for (let i = 0; i < amount; i++) {
    const uuid = crypto.randomUUID();
    messages[uuid] = {
      id: uuid,
      messageType: "ticket", //multiple types of messages "ticket" for something that can be assigned "spam" for a funny flavour spam email "feedback" comments on a resolved ticket etc
      agentAssigned: null,
      resolved: false,
      failCount: 0,
      activeItem: true,
      ticketType: "hardware",
      ticketDifficulty: 5,
      sender: "Mary",
      subject: "computer no go",
      body: `Hi,
        
        i was trying to write an email but the screen went all blue and then it beeped very loud and now the mouse is gone and the letters are very big and sideways.
        
        pls fix it asap I need to tell brenda about the birthday cake thing and this is very urgent
        
        thx
        Mary`,
      received: dayNumber,
    };
  }

  return messages;
};

export function spawnInboxItems(chaos, contract, dayNumber) {
  const num = calculateItemsToSpawn(dayNumber, chaos);
  const items = {};

  for (let i = 0; i < num; i++) {
    const type = pickType(chaos, contract);
    const template = pickTemplate(type);
    const id = nanoid();

    items[id] = {
      id,
      messageType: type,
      ...template,
      received: dayNumber,
      activeItem: true,
      resolved: false,
      failCount: 0,
      agentAssigned: null,
    };
  }
  return items;
}

function pickType(chaos, contract) {
  // weights: tickets = 1, spam = chaos/10, complaint = openComplaints * 0.5
  const spamWeight = chaos / 10;
  const ticketWeight = 1;
  const total = spamWeight + ticketWeight;

  const roll = Math.random() * total;
  if (roll < ticketWeight) return "ticket";
  return "spam";
}

function pickTemplate(type) {
  switch (type) {
    case "ticket":
      return TICKET_TEMPLATES[
        Math.floor(Math.random() * TICKET_TEMPLATES.length)
      ];
    case "complaint":
      return COMPLAINT_TEMPLATES[
        Math.floor(Math.random() * COMPLAINT_TEMPLATES.length)
      ];
    default:
      return SPAM_TEMPLATES[Math.floor(Math.random() * SPAM_TEMPLATES.length)];
  }
}
