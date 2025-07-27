"use client";

import Active from "@/components/Active";
import ContractComplete from "@/components/ContractComplete";
import GameOver from "@/components/GameOver";
import SetupScreen from "@/components/SetupScreen";
import Summary from "@/components/Summary";
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
