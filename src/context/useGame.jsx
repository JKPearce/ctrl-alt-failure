"use client";

import { GameContext } from "@/context/GameContext";
import {
  AGENT_ACTIONS,
  GAME_ACTIONS,
  INBOX_ACTIONS,
  LOG_TYPES,
} from "@/lib/config/actionTypes";
import { generateAgentComment } from "@/lib/helpers/agentHelpers";
import { generateNewMessages } from "@/lib/helpers/inboxHelpers";
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
    //generate initial inbox messages here based on contract etc
    const inbox = generateNewMessages(3);

    dispatch({
      type: GAME_ACTIONS.START_GAME,
      payload: {
        businessName,
        selectedAgents,
        inbox,
        selectedFounder,
        selectedContract,
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
        timestamp: Date.now(),
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

  const nextGameTick = () => {
    if (gameState.actionsPointsRemaining <= 0) return;
    spendEnergy();
  };

  const progressTickets = () => {
    Object.values(gameState.inbox).forEach((ticket) => {
      if (ticket.messageType !== "ticket") return;
      if (ticket.agentAssigned === null) return;
      if (ticket.resolved) return;

      //later create a helper function to calculate how many steps will be removed from modifiers like upgrades etc
      const nextStepsRemaining = ticket.stepsRemaining - 1;

      if (nextStepsRemaining <= 0) {
        console.log("Resolving: ", ticket);

        dispatch({
          type: INBOX_ACTIONS.RESOLVE_TICKET,
          payload: {
            ticketID: ticket.id,
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

        const agent = getAgentByID(ticket.agentAssigned);
        addEntryToLog(
          LOG_TYPES.RESOLVE_TICKET,
          agent.agentName,
          `${agent.agentName} has assigned Ticket #${ticket.id}.`
        );
      } else {
        console.log("Updating: ", ticket);

        dispatch({
          type: INBOX_ACTIONS.UPDATE_TICKET_PROGRESS,
          payload: {
            ticketID: ticket.id,
            stepsRemaining: nextStepsRemaining,
          },
        });
      }
    });
  };

  const replenishEnergy = (energy = DEFAULT_STARTING_ENERGY) => {
    dispatch({
      type: GAME_ACTIONS.REPLENISH_ENERGY,
      payload: {
        energy,
      },
    });
  };

  const addNewInboxItems = () => {
    const amountToGenerate = 2; //logic here /call helper function to calculate amount of items and the type of inbox item
    const items = generateNewMessages(amountToGenerate);

    //update inbox state
    dispatch({
      type: INBOX_ACTIONS.ADD_INBOX_ITEM,
      payload: {
        items,
      },
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
    nextGameTick,
    progressTickets,
    replenishEnergy,
    addNewInboxItems,
    endGame,
  };
};

export { useGame };
