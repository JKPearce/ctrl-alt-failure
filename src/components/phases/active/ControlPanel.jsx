"use client";

import { useGame } from "@/context/useGame";
import Link from "next/link";

const ControlPanel = () => {
  const { gameState, progressTickets, replenishEnergy, addNewInboxItems } =
    useGame();

  const handleDevAction = () => {
    progressTickets();
    replenishEnergy();
    addNewInboxItems();
  };

  return (
    <section className="navbar bg-base-300 text-base-content px-6 shadow-md">
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
            Energy{" "}
            <span className="font-bold text-base-content">
              {gameState.energyRemaining}
            </span>
          </div>
          <div className="opacity-70">
            💰{" "}
            <span className="font-bold text-base-content">
              ${gameState.money}
            </span>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleDevAction}>
          ☕ Take a Break
        </button>

        <span className="text-xs opacity-70">{gameState.playerName}</span>
      </div>
    </section>
  );
};

export { ControlPanel };
