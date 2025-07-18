"use client";

import { GameContext } from "@/context/GameContext";
import {
  AGENT_ACTIONS,
  GAME_ACTIONS,
  INBOX_ACTIONS,
  LOG_TYPES,
} from "@/lib/config/actionTypes";
import {
  createNewAgents,
  generateAgentComment,
} from "@/lib/helpers/agentHelpers";
import { createNewMessages } from "@/lib/helpers/inboxHelpers";
import { useContext } from "react";
import {
  DEFAULT_AGENT_CAPACITY,
  DEFAULT_INBOX_SIZE,
} from "../lib/config/defaultGameState";

const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within a GameProvider");
  }

  const { gameState, dispatch } = ctx;
  const commentTimeouts = new Map();

  const setPlayerName = (name) => {
    dispatch({ type: GAME_ACTIONS.SET_PLAYER_NAME, payload: name });
  };

  const setBusinessName = (name) => {
    dispatch({ type: GAME_ACTIONS.SET_BUSINESS_NAME, payload: name });
  };

  const startGame = (playerName, businessName) => {
    setPlayerName(playerName);
    setBusinessName(businessName);
    //generate inbox, agents and any other stuff here? well call the functions

    dispatch({
      type: GAME_ACTIONS.START_GAME,
      payload: {
        agents: createNewAgents(DEFAULT_AGENT_CAPACITY),
        inbox: createNewMessages(DEFAULT_INBOX_SIZE),
      },
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

    spendActionPoint(1);
    setAgentAction(agentID, "Working");

    addEntryToLog(
      LOG_TYPES.ASSIGN_TICKET,
      agent.agentName,
      `Ticket #${ticketID} assigned to ${gameState.agents[agentID].agentName}.`
    );

    triggerAgentComment(
      agentID,
      generateAgentComment(gameState, agentID, "assigned to ticket")
    );
  };

  const triggerAgentComment = (agentID, comment, duration = 10000) => {
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

  const spendActionPoint = (amount = 1) => {
    dispatch({
      type: GAME_ACTIONS.USE_ACTION_POINT,
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
    spendActionPoint();
  };

  return {
    gameState,
    setPlayerName,
    setBusinessName,
    startGame,
    assignTicketToAgent,
    triggerAgentComment,
    addEntryToLog,
    getAgentByID,
    spendActionPoint,
    setAgentAction,
    nextGameTick,
  };
};

export { useGame };
