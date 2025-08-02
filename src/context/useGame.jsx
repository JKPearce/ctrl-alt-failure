"use client";

import { GameContext } from "@/context/GameContext";
import {
  AGENT_ACTIONS,
  GAME_ACTIONS,
  INBOX_ACTIONS,
  LOG_TYPES,
} from "@/lib/config/actionTypes";
import {
  calculateItemsToSpawn,
  spawnInboxItems,
} from "@/lib/helpers/inboxHelpers";
import { useContext, useEffect } from "react";
import { DEFAULT_STARTING_ENERGY } from "../lib/config/defaultGameState";

const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within a GameProvider");
  }

  const { gameState, dispatch } = ctx;

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
      const totalItems = calculateItemsToSpawn(
        gameState.dayNumber,
        gameState.chaos
      );
      const [inbox] = await Promise.all([
        spawnInboxItems({
          chaos: gameState.chaos,
          contract: selectedContract,
          totalItems,
          dayNumber: 1,
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

  const assignTicketToAgent = (ticketID, agentID) => {
    // Always validate agent exists before proceeding
    const agent = getAgentByID(agentID);
    console.log(agent);
    if (!agent) return;

    dispatch({
      type: INBOX_ACTIONS.ASSIGN_TICKET,
      payload: {
        ticketID,
        agentID,
      },
    });

    spendEnergy(1);
    setAgentAction(agentID, "Working");

    addEntryToLog(
      LOG_TYPES.ASSIGN_TICKET,
      agent.agentName,
      `Ticket #${ticketID} assigned to ${gameState.agents[agentID].agentName}.`
    );
  };

  const addItemToInbox = (item) => {
    dispatch({
      type: INBOX_ACTIONS.ADD_INBOX_ITEM,
      payload: { item },
    });

    const newTicket = Object.values(item)[0]; // Get first item;
    addEntryToLog(
      LOG_TYPES.ADD_INBOX_ITEM,
      "System",
      `New ${newTicket.messageType} item added to inbox. From: ${newTicket.sender}`,
      gameState.gameTime.currentTick
    );
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

  const spendEnergy = (amount = 1) => {
    dispatch({
      type: GAME_ACTIONS.USE_ENERGY,
      payload: {
        actionCost: amount,
      },
    });
  };

  const getAgentByID = (agentID) => {
    if (agentID == null) return null;
    return gameState.agents[agentID] || null;
  };

  const gameTick = () => {
    dispatch({ type: GAME_ACTIONS.GAME_TICK });
  };

  const resolveTicket = (ticket) => {
    const agent = getAgentByID(ticket.agentAssigned);
    console.log("Resolving: ", ticket);

    dispatch({
      type: INBOX_ACTIONS.RESOLVE_TICKET,
      payload: {
        ticketID: ticket.id,
        resolvedBy: agent.id,
        resolutionNotes: ticket.resolutionNotes,
      },
    });

    setAgentAction(ticket.agentAssigned, "idle");

    addEntryToLog(
      LOG_TYPES.RESOLVE_SUCCESS,
      agent.agentName,
      `${agent.agentName} has assigned Ticket #${ticket.id}.`
    );
  };

  const replenishEnergy = (energy = DEFAULT_STARTING_ENERGY) => {
    dispatch({
      type: GAME_ACTIONS.REPLENISH_ENERGY,
      payload: {
        energy,
      },
    });
  };

  const endCurrentDay = () => {
    console.log("Ending current day");

    addEntryToLog(
      LOG_TYPES.END_DAY,
      "System",
      `Day ${gameState.dayNumber} ended.`
    );

    dispatch({
      type: GAME_ACTIONS.END_DAY,
      payload: {},
    });
  };

  const startNewDay = async () => {
    dispatch({
      type: GAME_ACTIONS.SET_LOADING,
      payload: { loading: true },
    });

    try {
      const [newItems] = await Promise.all([
        spawnInboxItems({
          chaos: gameState.chaos,
          contract: gameState.currentContract,
          totalItems: calculateItemsToSpawn(
            gameState.dayNumber + 1,
            gameState.chaos
          ),
          dayNumber: gameState.dayNumber + 1,
        }),
        new Promise((resolve) => setTimeout(resolve, 3000)), // 3-second minimum
      ]);

      //fire off functions to make new tweets or other actions that will happen on a new day

      addEntryToLog(
        LOG_TYPES.START_DAY,
        "System",
        `Day ${gameState.dayNumber + 1} started. ${
          Object.keys(newItems).length
        } new items added.`
      );

      replenishEnergy();

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

  const endGame = () => {
    console.log("Ending game");
    dispatch({
      type: GAME_ACTIONS.END_GAME,
    });
  };

  const pauseTime = () => dispatch({ type: GAME_ACTIONS.PAUSE_TIME });

  const resumeTime = () => dispatch({ type: GAME_ACTIONS.RESUME_TIME });

  const setTimeSpeed = (speed) =>
    dispatch({
      type: GAME_ACTIONS.SET_TIME_SPEED,
      payload: { speed },
    });

  const deleteSpam = (ticketID) => {
    dispatch({
      type: INBOX_ACTIONS.DELETE_SPAM,
      payload: { ticketID },
    });
  };

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
    assignTicketToAgent,
    addEntryToLog,
    getAgentByID,
    spendEnergy,
    setAgentAction,
    resolveTicket,
    replenishEnergy,
    endGame,
    endCurrentDay,
    startNewDay,
    deleteSpam,
    startNewContract,
    pauseTime,
    setTimeSpeed,
    resumeTime,
    gameTick,
    addItemToInbox,
  };
};

export { useGame };
