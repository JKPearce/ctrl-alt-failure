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
  const { createNewAgents } = useAgent();

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
        agentID: agentID,
        ticketID: ticketID,
      },
    });

    //call further functions here like "makeComment() from useAgent()"
  };

  return {
    gameState,
    setPlayerName,
    setBusinessName,
    startGame,
    assignTicketToAgent,
  };
};

export { useGame };
