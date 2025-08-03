import { PRE_GENERATED_AGENTS } from "@/lib/data/preGeneratedAgents";
import { AGENT_ACTIONS } from "../config/actionTypes";

const BEHAVIOR_TEMPLATES = {
  WORKAHOLIC: [
    { dispatchAction: AGENT_ACTIONS.WORKING, weight: 80 },
    { dispatchAction: AGENT_ACTIONS.CREATE_SCREAM, weight: 10 },
    { dispatchAction: AGENT_ACTIONS.ON_BREAK, weight: 10 },
  ],
  COMPLAINER: [
    { dispatchAction: AGENT_ACTIONS.WORKING, weight: 30 },
    { dispatchAction: AGENT_ACTIONS.CREATE_SCREAM, weight: 60 },
    { dispatchAction: AGENT_ACTIONS.ON_BREAK, weight: 10 },
  ],
  SLACKER: [
    { dispatchAction: AGENT_ACTIONS.WORKING, weight: 20 },
    { dispatchAction: AGENT_ACTIONS.CREATE_SCREAM, weight: 30 },
    { dispatchAction: AGENT_ACTIONS.ON_BREAK, weight: 50 },
  ],
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

//clear resolved ticket assignments remove the ticket ID from the agent object
export function clearResolvedTicketAssignments(agents, inbox) {
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
}

export const getRandomBehaviour = (agent) => {
  const agentBehaviors = BEHAVIOR_TEMPLATES[agent.behavior];
  if (!agentBehaviors) return null;

  const totalWeight = agentBehaviors.reduce(
    (sum, action) => sum + action.weight,
    0
  );
  const randomValue = Math.random() * totalWeight; // random number between 0 to totalWeight

  let cumulativeWeight = 0;
  for (const behaviour of agentBehaviors) {
    cumulativeWeight += behaviour.weight;
    if (randomValue <= cumulativeWeight) {
      return behaviour;
    }
  }
};
