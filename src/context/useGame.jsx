"use client";

import { GameContext } from "@/context/GameContext";
import {
  AGENT_ACTIONS,
  GAME_ACTIONS,
  INBOX_ACTIONS,
  LOG_TYPES,
} from "@/lib/config/actionTypes";
import { calcSuccessChance } from "@/lib/helpers/agentHelpers";
import {
  calculateItemsToSpawn,
  spawnInboxItems,
} from "@/lib/helpers/inboxHelpers";
import { useContext } from "react";
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

  const resolveTickets = () => {
    let resolvedTicketsCount = 0;

    Object.values(gameState.inbox).forEach((ticket) => {
      if (ticket.messageType !== "ticket") return;
      if (ticket.agentAssigned === null) return;
      if (ticket.resolved) return;

      const agent = getAgentByID(ticket.agentAssigned);

      const chance = calcSuccessChance(
        Number(agent.skills[ticket.ticketType]),
        Number(ticket.difficulty)
      );
      const success = Math.random() < chance;
      console.log("success chance  ", chance, " - Successful roll = ", success);

      if (success) {
        console.log("Resolving: ", ticket);

        resolvedTicketsCount++;

        dispatch({
          type: INBOX_ACTIONS.RESOLVE_TICKET,
          payload: {
            ticketID: ticket.id,
            resolvedBy: agent.id,
            successChance: chance,
            resolutionNotes: "Piece of cake.", //TODO: Create a function that calls LLM for fun "resolution notes"
          },
        });

        setAgentAction(ticket.agentAssigned, "idle");

        addEntryToLog(
          LOG_TYPES.RESOLVE_SUCCESS,
          agent.agentName,
          `${agent.agentName} has assigned Ticket #${ticket.id}.`
        );
      } else {
        addEntryToLog(
          LOG_TYPES.RESOLVE_FAIL,
          agent.agentName,
          `${agent.agentName} has failed to resolve Ticket #${
            ticket.id
          }. Success Chance: ${chance * 100}%`
        );

        addEntryToLog(
          LOG_TYPES.COMPLAINT_CREATED,
          agent.agentName,
          `A NEW COMPLAINT HAS BEEN CREATED`
        );

        dispatch({
          type: INBOX_ACTIONS.TICKET_FAIL,
          payload: {
            ticketID: ticket.id,
          },
        });
      }
    });

    return resolvedTicketsCount;
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
    const resolvedTicketsCount = resolveTickets();

    // Check for loss condition - inbox overflow
    const activeItems = Object.values(gameState.inbox).filter(
      (item) => item.activeItem
    ).length;
    const isGameOver = activeItems >= gameState.inboxSize;

    if (isGameOver) {
      endGame();
      return; // Don't continue with normal day end
    }

    addEntryToLog(
      LOG_TYPES.END_DAY,
      "System",
      `Day ${gameState.dayNumber} ended. ${resolvedTicketsCount} tickets resolved.`
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
    dispatch({
      type: GAME_ACTIONS.END_GAME,
    });
  };

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

  const addInboxItem = (item, time = 0) => {
    addEntryToLog(
      LOG_TYPES.ADD_INBOX_ITEM,
      "System",
      `New ${item.messageType} item added to inbox. From: ${item.sender}`,
      time
    );

    dispatch({
      type: INBOX_ACTIONS.ADD_INBOX_ITEM,
      payload: { item },
    });
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
    resolveTickets,
    replenishEnergy,
    endGame,
    endCurrentDay,
    startNewDay,
    deleteSpam,
    startNewContract,
  };
};

export { useGame };
