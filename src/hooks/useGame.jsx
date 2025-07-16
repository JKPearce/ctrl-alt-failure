"use client";

import { GameContext } from "@/context/GameContext";
import { GAME_ACTIONS } from "@/helpers/actionTypes";
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

  return {
    gameState,
    setPlayerName,
    setBusinessName,
  };
};

export { useGame };
