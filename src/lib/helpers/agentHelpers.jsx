import { PRE_GENERATED_AGENTS } from "../config/preGeneratedAgents";

export const generateNewAgents = (amount) => {
  const agents = {};
  const shuffled = [...PRE_GENERATED_AGENTS].sort(() => 0.5 - Math.random());

  for (let i = 0; i < amount; i++) {
    const uuid = crypto.randomUUID();
    const baseAgent = { ...shuffled[i % PRE_GENERATED_AGENTS.length] };

    agents[uuid] = {
      ...baseAgent,
      id: uuid,
      maxAssignedTickets: 1, //TODO: make this dynamic based on agent skill or special unlocks
      currentAssignedTickets: 0,
      currentAction: "idle",
      currentComment: null,
      profileImage: getRandomPortrait(
        baseAgent.gender,
        getAgeBracket(baseAgent.age)
      ),
    };
  }

  return agents;
};

const getRandomPortrait = (gender, ageBracket) => {
  const index = Math.floor(Math.random() * 7); // 0–6
  return `/images/agents/${gender.toLowerCase()}_${ageBracket.toLowerCase()} (${index}).png`;
};

const getAgeBracket = (age) => {
  if (age < 30) return "young";
  if (age < 50) return "middleage";
  return "old";
};

export const generateAgentComment = (state, agentID, context) => {
  //TODO: Logic here to send to do an API call based on the ticket and agent
  //switch case based on the context that gets sent "assgined to ticket" "resolved ticket"etc

  if (context === "assigned_ticket")
    return "What the hell did she even click? How do you break a screen, a mouse, and gravity in one email? Ugh — I’ll fix it, but if Brenda's cake comes up one more time, I’m bricking the whole network.";

  if (context === "resolved_ticket") return "Done and dusted, piece of cake";
  else return "Agent is making a generic comment";
};

/**
 * @param {number} skill      – agent.skills[ticket.type] (1–10)
 * @param {number} difficulty – ticket.difficulty    (1–10)
 * @returns {number}          – success chance, 0–0.95
 */
export const calcSuccessChance = (skill, difficulty) => {
  const raw = (skill / difficulty) * 0.95;
  console.log("skill: ", skill, " difficulty: ", difficulty, " Raw: ", raw);
  return Math.min(raw, 0.95);
};
