"use client";

import Active from "@/components/phases/active/Active";
import GameOver from "@/components/phases/game_over/GameOver";
import Setup from "@/components/phases/setup/Setup";
import Summary from "@/components/phases/summary/Summary";
import { useGame } from "@/context/useGame";

function GamePage() {
  const { gameState } = useGame();

  return (
    <>
      {gameState.gamePhase === "setup" && <Setup />}
      {gameState.gamePhase === "active" && <Active />}
      {gameState.gamePhase === "summary" && <Summary />}
      {gameState.gamePhase === "game_over" && <GameOver />}
    </>
  );
}

export default GamePage;
