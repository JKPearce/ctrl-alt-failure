"use client";

import Active from "@/components/phases/active/Active";
import Setup from "@/components/phases/setup/Setup";
import { useGame } from "@/context";

function GamePage() {
  const { gameState, startGame } = useGame();

  return (
    <>
      {gameState.gamePhase === "setup" && <Setup />}
      {gameState.gamePhase === "active" && <Active />}
      {gameState.gamePhase === "summary" && <div>{gameState.gamePhase}</div>}
    </>
  );
}

export default GamePage;
