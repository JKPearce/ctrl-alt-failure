"use client";

import { GameContext } from "@/context/GameContext";
import { GAME_ACTIONS, LOG_TYPES } from "@/lib/config/actionTypes";
import {
  calculateItemsToSpawn,
  spawnInboxItems,
} from "@/lib/helpers/inboxHelpers";
import { useContext, useEffect } from "react";

const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within a GameProvider");
  }

  const { gameState, dispatch } = ctx;

  useEffect(() => {
    if (gameState.gamePhase !== "active" || gameState.gameTime.isPaused) {
      return;
    }

    console.log("gameState.gameTime.speed", gameState.gameTime.speed);
    const interval = setInterval(() => {
      gameTick();
    }, 1000 / gameState.gameTime.speed);

    return () => clearInterval(interval);
  }, [
    gameState.gameTime.isPaused,
    gameState.gameTime.speed,
    gameState.gamePhase,
  ]);

  const startGame = async (
    businessName,
    selectedFounder,
    selectedContract,
    selectedAgents
  ) => {
    dispatch({
      type: GAME_ACTIONS.SET_LOADING,
      payload: { loading: true },
    });

    try {
      // Wait for BOTH the inbox generation AND the minimum 3-second timer
      const [inbox] = await Promise.all([
        spawnInboxItems({
          totalItems: calculateItemsToSpawn(1, selectedContract.baseChaos),
          dayNumber: 1,
          chaos: selectedContract.baseChaos,
          contract: selectedContract,
        }),
        new Promise((resolve) => setTimeout(resolve, 3000)), // 3-second minimum
      ]);

      const agentMap = {};
      selectedAgents.forEach((agent) => {
        agentMap[agent.id] = agent;
      });

      dispatch({
        type: GAME_ACTIONS.START_GAME,
        payload: {
          businessName,
          selectedAgents: agentMap,
          inbox,
          selectedFounder,
          contractId: selectedContract.id,
        },
      });
    } catch (error) {
      console.error("Failed to spawn inbox items:", error);
    } finally {
      // Only clear loading after everything is done
      dispatch({
        type: GAME_ACTIONS.SET_LOADING,
        payload: { loading: false },
      });
      addEntryToLog(LOG_TYPES.START_DAY, "System", `Game started.`);
    }
  };

  const restartGame = () => {
    dispatch({
      type: GAME_ACTIONS.RESTART_GAME,
    });
  };

  const addEntryToLog = (eventType, actor, message, time = 0) => {
    //type is defined as "assign_ticket", "agent_comment" see actionTypes.js for the ENUM define
    console.log("adding entry to log", eventType, actor, message, time);
    dispatch({
      type: GAME_ACTIONS.ADD_ACTIVITY_LOG,
      payload: {
        eventType,
        actor,
        message,
        time,
      },
    });
  };

  const gameTick = () => {
    dispatch({ type: GAME_ACTIONS.GAME_TICK });
  };

  const startNewDay = async () => {
    dispatch({
      type: GAME_ACTIONS.SET_LOADING,
      payload: { loading: true },
    });

    try {
      //setup inbox for new day
      const [newItems] = await Promise.all([
        spawnInboxItems({
          totalItems: calculateItemsToSpawn(
            gameState.dayNumber + 1,
            gameState.chaos
          ),
          dayNumber: gameState.dayNumber + 1,
          chaos: gameState.chaos,
          contract: gameState.currentContract,
        }),
        new Promise((resolve) => setTimeout(resolve, 3000)), // 3-second minimum
      ]);

      addEntryToLog(
        LOG_TYPES.START_DAY,
        "System",
        `Day ${gameState.dayNumber + 1} started. ${
          Object.keys(newItems).length
        } new items added.`
      );

      dispatch({
        type: GAME_ACTIONS.START_NEW_DAY,
        payload: {
          newItems,
        },
      });
    } catch (error) {
      console.error("Failed to spawn inbox items:", error);
    } finally {
      dispatch({
        type: GAME_ACTIONS.SET_LOADING,
        payload: { loading: false },
      });
    }
  };

  const pauseTime = () => dispatch({ type: GAME_ACTIONS.PAUSE_TIME });

  const resumeTime = () => dispatch({ type: GAME_ACTIONS.RESUME_TIME });

  const setTimeSpeed = (speed) =>
    dispatch({
      type: GAME_ACTIONS.SET_TIME_SPEED,
      payload: { speed },
    });

  const startNewContract = (selectedContract) => {
    //TODO add calculation for new chaos based on complaints left in inbox?
    dispatch({
      type: GAME_ACTIONS.START_NEW_CONTRACT,
      payload: {
        contract: selectedContract,
      },
    });

    startNewDay();
  };

  return {
    gameState,
    startGame,
    restartGame,
    addEntryToLog,
    startNewDay,
    startNewContract,
    pauseTime,
    setTimeSpeed,
    resumeTime,
    gameTick,
  };
};

export { useGame };
