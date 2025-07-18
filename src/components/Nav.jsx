"use client";

import { useGame } from "@/context/useGame";
import Link from "next/link";

const Nav = () => {
  const { gameState } = useGame();

  const handleDevAction = () => {
    console.log("Dev Action triggered");
  };

  return (
    <nav className="navbar bg-base-300 text-base-content px-6 shadow-md">
      <div className="flex-1">
        <Link
          href="/"
          className="btn btn-ghost normal-case text-xl text-primary"
        >
          {gameState.businessName}
        </Link>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex gap-4">
          <div className="opacity-70">
            Day{" "}
            <span className="font-bold text-base-content">
              {gameState.dayNumber}
            </span>
          </div>
          <div className="opacity-70">
            AP{" "}
            <span className="font-bold text-base-content">
              {gameState.actionsPointsRemaining}
            </span>
          </div>
          <div className="opacity-70">
            💰{" "}
            <span className="font-bold text-base-content">
              ${gameState.money}
            </span>
          </div>
        </div>

        <button className="btn btn-xs btn-warning" onClick={handleDevAction}>
          Dev Action
        </button>

        <span className="text-xs opacity-70">{gameState.playerName}</span>
      </div>
    </nav>
  );
};

export { Nav };
