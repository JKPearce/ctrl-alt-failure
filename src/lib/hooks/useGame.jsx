"use client";

import { GameContext } from "@/context/GameContext";
import { AGENT_ACTIONS, GAME_ACTIONS } from "@/lib/config/actionTypes";
import { useContext } from "react";
import {
  DEFAULT_AGENT_CAPACITY,
  DEFAULT_INBOX_SIZE,
} from "../config/defaultGameState";
import { useAgent } from "./useAgent";
import { useInbox } from "./useInbox";

const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within a GameProvider");
  }

  const { gameState, dispatch } = ctx;
  const { createNewMessages } = useInbox();
  const { createNewAgents, generateAgentComment } = useAgent();
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
    if (!agent) return;

    dispatch({
      type: AGENT_ACTIONS.ASSIGN_TICKET,
      payload: {
        ticketID,
        agentID,
      },
    });

    dispatch({
      type: GAME_ACTIONS.USE_ACTION_POINT,
      payload: {
        actionCost: 1, //can call a function here to calc cost of action
      },
    });

    addEntryToLog(
      "assign_ticket",
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

    // Always validate agent exists before proceeding
    const agent = getAgentByID(agentID);
    if (!agent) return;

    dispatch({
      type: AGENT_ACTIONS.SET_AGENT_COMMENT,
      payload: {
        agentID,
        comment,
        //note to self, if the Key:value is the same variable, you can short hand them in 1 call
      },
    });

    addEntryToLog("agent_comment", agent.agentName, comment);

    const timeout = setTimeout(() => {
      dispatch({
        type: AGENT_ACTIONS.SET_AGENT_COMMENT,
        payload: { agentID, comment: null },
      });
      commentTimeouts.delete(agentID);
    }, duration);

    commentTimeouts.set(agentID, timeout);
  };

  const addEntryToLog = (type, actor, message) => {
    dispatch({
      type: GAME_ACTIONS.ADD_ACTIVITY_LOG,
      payload: {
        type,
        actor,
        message,
        timestamp: Date.now(),
      },
    });
  };

  const getAgentByID = (agentID) => {
    if (agentID == null) return null;
    return gameState.agents.find((a) => a.id === agentID) || null;
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
  };
};

export { useGame };
