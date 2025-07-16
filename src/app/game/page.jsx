"use client";

import Setup from "@/components/phases/active/setup/Setup";
import { useGame } from "@/context";

function GamePage() {
  const { gameState, startGame } = useGame();

  return (
    <>
      {gameState.gamePhase === "setup" && <Setup />}
      {gameState.gamePhase === "active" && <div>{gameState.gamePhase}</div>}
      {gameState.gamePhase === "summary" && <div>{gameState.gamePhase}</div>}
    </>
  );
}

export default GamePage;
