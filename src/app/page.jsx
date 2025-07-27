"use client";

import Active from "@/components/phases/active/Active";
import ContractComplete from "@/components/phases/contract_complete/ContractComplete";
import GameOver from "@/components/phases/game_over/GameOver";
import SetupScreen from "@/components/phases/setup/SetupScreen";
import Summary from "@/components/phases/summary/Summary";
import { useGame } from "@/context/useGame";
import { useEffect } from "react";

function GamePage() {
  const { gameState } = useGame();

  useEffect(() => {
    console.log("updated gamestate: ", gameState);
  }, [gameState]);

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
