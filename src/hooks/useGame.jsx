"use client";
import { GameContext } from "@/context/GameContext";
import { useContext } from "react";

const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return ctx;
};

export { useGame };
