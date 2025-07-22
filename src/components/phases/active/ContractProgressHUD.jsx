"use client";

import { GameContext } from "@/context/GameContext"; // ← adjust path if you renamed
import { getContract } from "@/lib/helpers/contractHelpers";
import { useContext } from "react";

const ContractProgressHUD = () => {
  const { gameState } = useContext(GameContext);

  if (!gameState?.currentContract?.id) return null;

  const { id, ticketsResolved, ticketsRequired } = gameState.currentContract;
  const contract = getContract(id);
  const pct = Math.min(
    100,
    Math.round((ticketsResolved / ticketsRequired) * 100)
  );

  return (
    <div className="w-full bg-base-200 border-b border-base-300 p-3 flex items-center gap-4">
      {/* Contract name */}
      <span className="font-semibold">{contract.name}</span>

      {/* Progress bar */}
      <div className="flex-1">
        <div className="h-2 w-full bg-base-300 rounded-box">
          <div
            className="h-2 bg-primary rounded-box transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs opacity-70">
          {ticketsResolved}/{ticketsRequired} tickets
        </span>
      </div>

      {/* Optional: cash reward preview */}
      {contract.reward?.cash && (
        <div className="stat px-2">
          <div className="stat-title text-xs">Reward</div>
          <div className="stat-value text-sm">
            ${contract.reward.cash.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractProgressHUD;
