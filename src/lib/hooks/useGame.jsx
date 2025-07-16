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

    setAgentComment(
      agentID,
      generateAgentComment(gameState, agentID, "assigned to ticket")
    );

    //call further functions here like "makeComment() from useAgent()"
  };

  const setAgentComment = (agentID, comment, duration = 10000) => {
    // Clear existing timeout if one exists
    const existing = commentTimeouts.get(agentID);
    if (existing) clearTimeout(existing);

    dispatch({
      type: AGENT_ACTIONS.SET_AGENT_COMMENT,
      payload: {
        agentID,
        comment,
        //note to self, if the Key:value is the same variable, you can short hand them in 1 call
      },
    });

    //here we could add an item to the actionslog as well with the comment

    const timeout = setTimeout(() => {
      dispatch({
        type: AGENT_ACTIONS.SET_AGENT_COMMENT,
        payload: { agentID, comment: null },
      });
      commentTimeouts.delete(agentID);
    }, duration);

    commentTimeouts.set(agentID, timeout);
  };

  return {
    gameState,
    setPlayerName,
    setBusinessName,
    startGame,
    assignTicketToAgent,
    setAgentComment,
  };
};

export { useGame };
