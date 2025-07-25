"use client";

import { GameContext } from "@/context/GameContext";
import {
  AGENT_ACTIONS,
  GAME_ACTIONS,
  INBOX_ACTIONS,
  LOG_TYPES,
} from "@/lib/config/actionTypes";
import {
  calcSuccessChance,
  generateAgentComment,
} from "@/lib/helpers/agentHelpers";
import {
  generateNewMessages,
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
  const commentTimeouts = new Map();

  const startGame = (
    businessName,
    selectedFounder,
    selectedContract,
    selectedAgents
  ) => {
    const numOfItems = selectedContract.baseInboxSize; // simple
    const inbox = spawnInboxItems(
      gameState.chaos,
      selectedContract,
      numOfItems,
      gameState.dayNumber
    );

    // Convert selectedAgents from an array into an object keyed by agent.id.
    // This ensures agents are stored in gameState.agents as a lookup object (e.g. { [id]: agent }),
    // which is required for reducers and ticket assignment logic to work correctly.
    // UUID strings can't be accessed via numeric indexing, so object lookup is required.
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

    spendEnergy();

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

    triggerAgentComment(
      agentID,
      generateAgentComment(gameState, agentID, "assign_ticket")
    );
  };

  const triggerAgentComment = (agentID, comment, duration = 3000) => {
    // Clear existing timeout if one exists
    const existing = commentTimeouts.get(agentID);
    if (existing) clearTimeout(existing);

    // Always validate agent exists in current state before proceeding
    const agent = getAgentByID(agentID);
    if (!agent) return;

    dispatch({
      type: AGENT_ACTIONS.SET_AGENT_COMMENT,
      payload: {
        agentID,
        comment,
      },
    });

    addEntryToLog(LOG_TYPES.AGENT_COMMENT, agent.agentName, comment);

    //this removes the comment after the specified duration so i can call render the comment dynamicly without needing a useEffect and timeout initilised on call change of the "currentComment"
    const timeout = setTimeout(() => {
      dispatch({
        type: AGENT_ACTIONS.SET_AGENT_COMMENT,
        payload: { agentID, comment: null },
      });
      commentTimeouts.delete(agentID);
    }, duration);

    commentTimeouts.set(agentID, timeout);
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

  const addEntryToLog = (eventType, actor, message) => {
    //type is defined as "assign_ticket", "agent_comment" see actionTypes.js for the ENUM define
    dispatch({
      type: GAME_ACTIONS.ADD_ACTIVITY_LOG,
      payload: {
        eventType,
        actor,
        message,
        day: gameState.dayNumber,
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
        triggerAgentComment(
          ticket.agentAssigned,
          generateAgentComment(
            gameState,
            ticket.agentAssigned,
            "resolved_ticket"
          )
        );

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

  const addNewInboxItems = (amountToGenerate = 2) => {
    const items = generateNewMessages(amountToGenerate, gameState.dayNumber);

    //update inbox state
    dispatch({
      type: INBOX_ACTIONS.ADD_INBOX_ITEM,
      payload: {
        items,
      },
    });
  };

  const endCurrentDay = () => {
    //calculate contract satisfaction score
    resolveTickets();
    replenishEnergy();

    dispatch({
      type: GAME_ACTIONS.END_DAY,
      payload: {},
    });
  };

  const startNewDay = () => {
    addNewInboxItems(2); //eventually ill have more functions here to check other modifiers like type of emails, complains, spam, tickets etc
    //fire off functions to make new tweets or other actions that will happen on a new day

    dispatch({
      type: GAME_ACTIONS.START_NEW_DAY,
      payload: {},
    });
  };

  const endGame = () => {
    dispatch({
      type: GAME_ACTIONS.END_GAME,
    });
  };

  return {
    gameState,
    startGame,
    restartGame,
    assignTicketToAgent,
    triggerAgentComment,
    addEntryToLog,
    getAgentByID,
    spendActionPoint: spendEnergy,
    setAgentAction,
    progressTickets: resolveTickets,
    replenishEnergy,
    addNewInboxItems,
    endGame,
    endCurrentDay,
    startNewDay,
  };
};

export { useGame };
