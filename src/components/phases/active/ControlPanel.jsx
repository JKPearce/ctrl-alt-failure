// ControlPanel.jsx — refactored with expandable drawer, controls, and theme

"use client";

import { useGame } from "@/context/useGame";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";

const ControlPanel = () => {
  const { gameState, endCurrentDay, endGame } = useGame();

  const [logOpen, setLogOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleDevAction = () => {
    endCurrentDay();
  };

  const handleResetGame = () => {
    setConfirmReset(true);
  };

  const confirmEndGame = () => {
    setConfirmReset(false);
    endGame();
  };

  return (
    <div className="relative w-full">
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
          <div className="opacity-70">
            ⚡ Energy:{" "}
            <span className="font-bold text-base-content">
              {gameState.energyRemaining}
            </span>
          </div>
          <div className="opacity-70">💰 ${gameState.money}</div>

          <button className="btn btn-sm btn-outline" onClick={handleDevAction}>
            End Day
          </button>

          <button
            className="btn btn-sm btn-outline"
            onClick={() => setLogOpen((prev) => !prev)}
          >
            📜 Activity Log
          </button>

          <button className="btn btn-sm btn-error" onClick={handleResetGame}>
            ⛔ Restart
          </button>
        </div>
      </nav>

      {logOpen && (
        <div className="absolute top-full right-0 w-full z-30">
          <div className="card bg-base-100 shadow-xl border border-base-300 max-h-80 overflow-y-auto">
            <div className="card-body space-y-2">
              <h3 className="card-title">📜 Activity Log</h3>
              <ul className="space-y-2 text-sm">
                {gameState.activityLog.length === 0 && (
                  <li className="text-base-content/60 italic">
                    No activity yet.
                  </li>
                )}
                {gameState.activityLog.map((entry, i) => (
                  <li
                    key={i}
                    className={`rounded-md px-3 py-2 border-l-4 ${
                      entry.eventType === "agent_comment"
                        ? "bg-base-200 border-warning"
                        : "bg-base-300 border-info"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-base-content">
                        {entry.actor}
                      </span>
                      <span className="text-xs text-base-content/50">
                        {format(entry.timestamp, "HH:mm:ss")}
                      </span>
                    </div>
                    <p className="text-sm leading-snug text-base-content">
                      {entry.message}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {confirmReset && (
        <div className="modal modal-open">
          <div className="modal-box bg-base-100">
            <h3 className="font-bold text-lg">Restart Game?</h3>
            <p className="py-2 text-sm text-base-content/70">
              This will reset all progress. Are you sure?
            </p>
            <div className="modal-action">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setConfirmReset(false)}
              >
                Cancel
              </button>
              <button className="btn btn-error btn-sm" onClick={confirmEndGame}>
                Confirm Restart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { ControlPanel };
