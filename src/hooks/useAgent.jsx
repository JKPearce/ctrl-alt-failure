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

      switch (selectedAction.dispatchAction) {
        case AGENT_ACTIONS.WORKING:
          setAgentAction(agent.id, AGENT_ACTIONS.WORKING);
          break;
        case AGENT_ACTIONS.CREATE_SCREAM:
          setAgentAction(agent.id, AGENT_ACTIONS.CREATE_SCREAM);
          break;
        case AGENT_ACTIONS.ON_BREAK:
          setAgentAction(agent.id, AGENT_ACTIONS.ON_BREAK);
          break;
        case AGENT_ACTIONS.IDLE:
          setAgentAction(agent.id, AGENT_ACTIONS.IDLE);
          break;
        default:
          console.log("selected action is not handled: ", selectedAction);
      }
    });
  };

  const setAgentAction = (agentID, action) => {
    dispatch({
      type: AGENT_ACTIONS.SET_AGENT_ACTION,
      payload: { agentID, action },
    });
  };

  return {
    handleAgentBehaviors,
  };
};

export { useAgent };
