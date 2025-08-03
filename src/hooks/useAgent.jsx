import { GameContext } from "@/context/GameContext";
import { AGENT_ACTIONS, SCREAM_ACTIONS } from "@/lib/config/actionTypes";
import { getRandomBehaviour } from "@/lib/helpers/agentHelpers";
import { formatGameTime } from "@/lib/helpers/gameHelpers";
import { useContext, useEffect, useRef } from "react";

const useAgent = () => {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within a GameProvider");
  }

  const { gameState, dispatch } = ctx;
  const isProcessing = useRef(false);

  useEffect(() => {
    //dont check on start of game or if paused
    if (gameState.gamePhase !== "active") return;
    if (gameState.gameTime.isPaused) return;
    if (gameState.gameTime.currentTick === 0) return;

    if (gameState.gameTime.currentTick % 30 === 0) {
      handleAgentBehaviors();
    }
  }, [gameState.gameTime.currentTick]);

  const handleAgentBehaviors = async () => {
    if (isProcessing.current) return;

    isProcessing.current = true;
    try {
      const agents = Object.values(gameState.agents);

      for (const agent of agents) {
        const selectedAction = getRandomBehaviour(agent);
        const previousAction = agent.currentAction;

        // Check cooldown for screams
        if (selectedAction.dispatchAction === AGENT_ACTIONS.CREATE_SCREAM) {
          if (!canAgentScream(agent)) {
            continue; // Skip this agent
          }
        }

        switch (selectedAction.dispatchAction) {
          case AGENT_ACTIONS.WORKING:
            setAgentAction(agent.id, AGENT_ACTIONS.WORKING);
            break;
          case AGENT_ACTIONS.CREATE_SCREAM:
            setAgentAction(agent.id, AGENT_ACTIONS.CREATE_SCREAM);

            try {
              const screamData = await createScream(agent);
              dispatch({
                type: SCREAM_ACTIONS.ADD_SCREAM,
                payload: {
                  screamId: crypto.randomUUID(),
                  message: screamData.screamMessage,
                  agentID: agent.id,
                },
              });

              // Wait before returning to previous action
              await new Promise((resolve) =>
                setTimeout(resolve, 2000 / gameState.gameTime.speed)
              );
              setAgentAction(agent.id, previousAction);
            } catch (error) {
              console.error("Failed to create scream:", error);
              await new Promise((resolve) =>
                setTimeout(resolve, 1000 / gameState.gameTime.speed)
              );
              setAgentAction(agent.id, previousAction);
            }

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
      }
    } catch (error) {
      console.error("Error in handleAgentBehaviors:", error);
    } finally {
      isProcessing.current = false;
    }
  };

  const canAgentScream = (agent) => {
    const lastScreamInLog = agent.behaviourLog.find(
      (log) =>
        log.action === AGENT_ACTIONS.CREATE_SCREAM &&
        log.day === gameState.dayNumber
    );

    if (!lastScreamInLog) return true; // No previous scream today

    const timeSinceLastScream =
      gameState.gameTime.currentTick - lastScreamInLog.time;

    return timeSinceLastScream >= 60; // 60 tick cooldown
  };

  const createScream = async (agent) => {
    const currentTicket = gameState.inbox[agent.assignedTicketId] || null;

    const response = await fetch("/api/scream", {
      method: "POST",
      body: JSON.stringify({
        agent,
        currentTicket,
        chaos: gameState.chaos,
        currentTime: formatGameTime(gameState.gameTime.currentTick),
        currentDay: gameState.day,
      }),
    });

    const data = await response.json();

    return data;
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
