"use client";

import { GameContext } from "@/context/GameContext";
import { GAME_ACTIONS } from "@/lib/config/actionTypes";
import { useContext } from "react";

const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within a GameProvider");
  }

  const { gameState, dispatch } = ctx;

  const setPlayerName = (name) => {
    dispatch({ type: GAME_ACTIONS.SET_PLAYER_NAME, payload: name });
  };

  const setBusinessName = (name) => {
    dispatch({ type: GAME_ACTIONS.SET_BUSINESS_NAME, payload: name });
  };

  const startGame = (playerName, businessName) => {
    setPlayerName(playerName);
    setBusinessName(businessName);

    const agents = [
      {
        id: 1,
        agentName: "Bobby",
        personality: "sarcastic",
        age: "45",
        skillLevel: "intermediate",
      },
    ];
    const inbox = [
      {
        id: 1,
        sender: "Mary",
        subject: "computer no go",
        message: `Hi,

i was trying to write an email but the screen went all blue and then it beeped very loud and now the mouse is gone and the letters are very big and sideways.

pls fix it asap I need to tell brenda about the birthday cake thing and this is very urgent

thx
Mary`,
        received: Date.now(),
      },
    ];

    dispatch({
      type: GAME_ACTIONS.START_GAME,
      payload: {
        agents: agents,
        inbox: inbox,
      },
    });
  };

  return {
    gameState,
    setPlayerName,
    setBusinessName,
    startGame,
  };
};

export { useGame };
