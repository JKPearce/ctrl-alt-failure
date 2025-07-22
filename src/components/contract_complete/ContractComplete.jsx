"use client";

import { GameContext } from "@/context/GameContext"; // ← adjust import path
import { GAME_ACTIONS } from "@/lib/config/actionTypes";
import { getContract } from "@/lib/helpers/contractHelpers";
import { useContext } from "react";

const ContractComplete = () => {
  const { gameState, dispatch } = useContext(GameContext);

  // Safety guard → don’t render until state is populated
  if (!gameState?.currentContract?.id) return null;

  const { id, ticketsResolved, ticketsRequired } = gameState.currentContract;
  const contract = getContract(id);

  // Fallback if catalogue ID went missing (shouldn’t happen)
  if (!contract) return null;

  const percent = Math.min(
    100,
    Math.round((ticketsResolved / ticketsRequired) * 100)
  );

  /* ----- Handlers ----- */
  const handleNextContract = () =>
    dispatch({ type: GAME_ACTIONS.OPEN_CONTRACT_PICKER }); // stub → rename later

  const handleMainMenu = () => dispatch({ type: GAME_ACTIONS.RESTART_GAME });

  /* ----- UI ----- */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-200/90 p-4">
      <div className="card w-full max-w-xl shadow-xl bg-base-100">
        <div className="card-body gap-4">
          <h2 className="card-title text-3xl">🎉 Contract Complete!</h2>

          <p className="text-lg font-semibold">{contract.name}</p>

          {/* Progress bar */}
          <div className="w-full bg-base-300 rounded-box h-3">
            <div
              className="bg-primary h-3 rounded-box"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-sm text-right opacity-60">
            {ticketsResolved}/{ticketsRequired} tickets resolved
          </p>

          {/* Reward */}
          {contract.reward?.cash && (
            <div className="stats shadow mt-4">
              <div className="stat">
                <div className="stat-title">Cash Earned</div>
                <div className="stat-value">
                  ${contract.reward.cash.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="card-actions justify-end pt-4">
            <button className="btn btn-secondary" onClick={handleMainMenu}>
              Main Menu
            </button>
            <button className="btn btn-primary" onClick={handleNextContract}>
              Next Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractComplete;
