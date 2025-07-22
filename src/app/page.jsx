"use client";

import ContractComplete from "@/components/contract_complete/ContractComplete";
import Active from "@/components/phases/active/Active";
import GameOver from "@/components/phases/game_over/GameOver";
import SetupScreen from "@/components/phases/setup/SetupScreen";
import Summary from "@/components/phases/summary/Summary";
import { useGame } from "@/context/useGame";

function GamePage() {
  const { gameState } = useGame();

  return (
    <>
      {gameState.gamePhase === "setup" && <SetupScreen />}
      {gameState.gamePhase === "active" && <Active />}
      {gameState.gamePhase === "summary" && <Summary />}
      {gameState.gamePhase === "game_over" && <GameOver />}
      {gameState.gamePhase === "contract_complete" && <ContractComplete />}
    </>
  );
}

export default GamePage;
