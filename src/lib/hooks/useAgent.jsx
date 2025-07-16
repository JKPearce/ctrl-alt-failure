"use client";

function useAgent() {
  const createNewAgents = (amount) => {
    //eventually this will be an API call to get a unique agent personalities and traits    const agents = [];
    const agents = {};

    for (let i = 0; i < amount; i++) {
      agents[i] = {
        id: i,
        agentName: "Terry Blazer",
        nickName: "Blaze",
        age: "39",
        personality: {
          traits: ["angry", "impatient", "abrasive"],
          quirks: [
            "swears at error messages",
            "has broken 3 keyboards this quarter",
            "keeps a stress ball collection with names",
          ],
          likes: [
            "solving things fast",
            "screaming into the void",
            "flipping off the server rack",
          ],
          dislikes: [
            "slow Wi-Fi",
            "printers",
            "people who ask 'have you tried turning it off and on again?'",
          ],
          favFood: "double-shot espresso with chili flakes",
        },
        skills: {
          hardware: 8,
          software: 5,
          people: -2,
        },
        assignedTicket: null,
        currentAction: "idle",
        currentEmotion: "furious",
        moodScore: -7,
        personalStatement: `I'm not here to coddle end-users or listen to Brenda cry about her Outlook not syncing. You give me the problem, I swear at it until it works, and then I get back to drinking liquid rage. If you want soft skills, hire a therapy dog. You want results? You call Blaze.`,
        memoryLog: [
          "Threw a monitor across the room after a driver update loop",
          "Told a user to 'sacrifice the router to the Wi-Fi gods' — it worked",
          "Filed a ticket against management for 'existential incompetence'",
        ],
      };
    }

    return agents;
  };

  return { createNewAgents };
}

export { useAgent };
