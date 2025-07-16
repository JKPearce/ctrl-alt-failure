"use client";

function useAgent() {
  const createNewAgents = (amount) => {
    //eventually this will be an API call to get a unique agent personalities and traits    const agents = [];
    const agents = [];

    for (let i = 0; i < amount; i++) {
      const agent = {
        id: 1,
        agentName: "Bobby",
        personality: "sarcastic",
        age: "45",
        skillLevel: "intermediate",
      };
      agents.push(agent);
    }

    return agents;
  };

  return { createNewAgents };
}

export { useAgent };
