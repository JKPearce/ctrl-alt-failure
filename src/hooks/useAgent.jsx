import { GameContext } from "@/context/GameContext";
import { AGENT_ACTIONS } from "@/lib/config/actionTypes";
import { getRandomBehaviour } from "@/lib/helpers/agentHelpers";
import { useContext, useEffect } from "react";

const useAgent = () => {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within a GameProvider");
  }

  const { gameState, dispatch } = ctx;

  useEffect(() => {
    //dont check on start of game or if paused
    if (gameState.gamePhase !== "active") return;
    if (gameState.gameTime.isPaused) return;
    if (gameState.gameTime.currentTick === 0) return;

    if (gameState.gameTime.currentTick % 30 === 0) {
      handleAgentBehaviors();
    }
  }, [gameState.gameTime.currentTick]);

  const handleAgentBehaviors = () => {
    const agents = Object.values(gameState.agents);

    agents.forEach((agent) => {
      const selectedAction = getRandomBehaviour(agent);
      console.log("selectedAction", selectedAction);
      switch (selectedAction.dispatchAction) {
        case AGENT_ACTIONS.WORKING:
          console.log("agent is working", agent.agentName);
          break;
        case AGENT_ACTIONS.CREATE_SCREAM:
          console.log("agent is creating a scream", agent.agentName);
          break;
        case AGENT_ACTIONS.ON_BREAK:
          console.log("agent is on break", agent.agentName);
          break;
      }
    });
  };

  const getAgentByID = (agentID) => {
    if (agentID == null) return null;
    return gameState.agents[agentID] || null;
  };

  const setAgentAction = (agentID, action) => {
    dispatch({
      type: AGENT_ACTIONS.SET_AGENT_ACTION,
      payload: {
        agentID,
        action,
      },
    });
  };

  return {
    getAgentByID,
    setAgentAction,
  };
};

export { useAgent };
