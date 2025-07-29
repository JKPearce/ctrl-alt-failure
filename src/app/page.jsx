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

  if (gameState.loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-lg">Starting new Day ...</p>
        </div>
      </div>
    );
  }

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
