"use client";

import Active from "@/components/phases/active/Active";
import Setup from "@/components/phases/setup/Setup";
import Summary from "@/components/phases/summary/Summary";
import { useGame } from "@/lib/hooks/useGame";

function GamePage() {
  const { gameState } = useGame();

  return (
    <>
      {gameState.gamePhase === "setup" && <Setup />}
      {gameState.gamePhase === "active" && <Active />}
      {gameState.gamePhase === "summary" && <Summary />}
    </>
  );
}

export default GamePage;
