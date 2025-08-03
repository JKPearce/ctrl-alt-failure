"use client";

import { GameContext } from "@/context/GameContext";
import { INBOX_ACTIONS } from "@/lib/config/actionTypes";
import { spawnNewTicket } from "@/lib/helpers/inboxHelpers";
import { useContext, useEffect } from "react";

const useInbox = () => {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within a GameProvider");
  }

  const { gameState, dispatch } = ctx;

  useEffect(() => {
    //dont check on start of game or if paused
    if (gameState.gamePhase !== "active") return;
    if (gameState.gameTime.isPaused) return;
    if (gameState.gameTime.currentTick === 0) return;

    // every "15 mins" in the game time
    if (gameState.gameTime.currentTick % 15 === 0) {
      handleTickSpawn();
    }
  }, [gameState.gameTime.currentTick]);

  const handleTickSpawn = async () => {
    // check based on chaos% chance of a new ticket
    const shouldSpawnTicket = Math.random() < gameState.chaos / 100;

    if (shouldSpawnTicket) {
      try {
        //returns a keyed object with the ticket as the value
        const newTicket = await spawnNewTicket(
          gameState.currentContract,
          gameState.chaos,
          gameState.dayNumber,
          gameState.gameTime.currentTick
        );

        const newTicketObject = {
          [newTicket.id]: newTicket,
        };

        addItemToInbox(newTicketObject);
      } catch (error) {
        console.error("Error generating ticket", error);
      }
    }
  };

  const assignTicketToAgent = (ticketID, agentID) => {
    dispatch({
      type: INBOX_ACTIONS.ASSIGN_TICKET,
      payload: {
        ticketID,
        agentID,
      },
    });
  };

  const addItemToInbox = (item) => {
    dispatch({
      type: INBOX_ACTIONS.ADD_INBOX_ITEM,
      payload: { item },
    });
  };

  const deleteSpam = (ticketID) => {
    dispatch({
      type: INBOX_ACTIONS.DELETE_SPAM,
      payload: { ticketID },
    });
  };

  return {
    addItemToInbox,
    assignTicketToAgent,
    deleteSpam,
  };
};

export { useInbox };
