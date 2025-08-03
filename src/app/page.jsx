"use client";

import Active from "@/components/Active";
import ContractComplete from "@/components/ContractComplete";
import GameOver from "@/components/GameOver";
import SetupScreen from "@/components/SetupScreen";
import Summary from "@/components/Summary";
import { useGame } from "@/hooks/useGame";

function GamePage() {
  const {
    gameState,
    gameTick,
    pauseTime,
    resumeTime,
    setTimeSpeed,
    startGame,
    startNewDay,
    restartGame,
    startNewContract,
  } = useGame();

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
      {gameState.gamePhase === "setup" && <SetupScreen startGame={startGame} />}
      {gameState.gamePhase === "active" && (
        <Active
          gameState={gameState}
          gameTick={gameTick}
          pauseTime={pauseTime}
          resumeTime={resumeTime}
          setTimeSpeed={setTimeSpeed}
        />
      )}
      {gameState.gamePhase === "summary" && (
        <Summary
          startNewDay={startNewDay}
          today={gameState.dailySummaries[0]}
        />
      )}
      {gameState.gamePhase === "game_over" && (
        <GameOver restartGame={restartGame} gameState={gameState} />
      )}
      {gameState.gamePhase === "contract_complete" && (
        <ContractComplete
          startNewContract={startNewContract}
          gameState={gameState}
        />
      )}
    </>
  );
}

export default GamePage;
