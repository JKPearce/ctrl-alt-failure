import { PRE_GENERATED_AGENTS } from "@/lib/data/preGeneratedAgents";

//weights for the likelihood of an action being chosen based on the agent's personality
const PERSONALITY_TEMPLATES = {
  WORKAHOLIC: {
    working: { WORKING: 90, CREATE_SCREAM: 5, ON_BREAK: 5, IDLE: 0 },
    idle: { IDLE: 80, CREATE_SCREAM: 10, ON_BREAK: 10, WORKING: 0 },
  },
  SLACKER: {
    working: { WORKING: 40, CREATE_SCREAM: 30, ON_BREAK: 30, IDLE: 0 },
    idle: { IDLE: 60, CREATE_SCREAM: 25, ON_BREAK: 15, WORKING: 0 },
  },
  COMPLAINER: {
    working: { WORKING: 50, CREATE_SCREAM: 40, ON_BREAK: 10, IDLE: 0 },
    idle: { IDLE: 40, CREATE_SCREAM: 50, ON_BREAK: 10, WORKING: 0 },
  },
};

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
      profileImage: getRandomPortrait(
        baseAgent.gender,
        getAgeBracket(baseAgent.age)
      ),
      currentAction: "IDLE",
      assignedTicketId: null,
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

//clear resolved ticket assignments remove the ticket ID from the agent object
export const clearResolvedTicketAssignments = (agents, inbox) => {
  return Object.fromEntries(
    Object.entries(agents).map(([agentId, agent]) => {
      if (agent.assignedTicketId && inbox[agent.assignedTicketId]?.resolved) {
        return [
          agentId,
          { ...agent, assignedTicketId: null, currentAction: "idle" },
        ];
      }
      return [agentId, agent];
    })
  );
};

//gets a random behaviour for the agent based on their personality and if they have an assigned ticket
export const getRandomBehaviour = (agent) => {
  const template = PERSONALITY_TEMPLATES[agent.behavior];
  const context = agent.assignedTicketId ? "working" : "idle";

  const behaviours = Object.entries(template[context]).map(
    ([action, weight]) => ({
      dispatchAction: action,
      weight,
    })
  );

  // Weighted selection logic
  const totalWeight = behaviours.reduce(
    (sum, action) => sum + action.weight,
    0
  );
  const randomValue = Math.random() * totalWeight;

  let cumulativeWeight = 0;
  for (const behaviour of behaviours) {
    cumulativeWeight += behaviour.weight;
    if (randomValue <= cumulativeWeight) {
      return behaviour;
    }
  }
};
