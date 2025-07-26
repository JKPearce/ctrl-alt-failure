"use client";

import { useGame } from "@/context/useGame";
import contractsData from "@/lib/data/contracts.json";
import { useEffect, useState } from "react";

const getRandomContracts = (contracts, n = 3) => {
  const shuffled = [...contracts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

const ContractComplete = () => {
  const { gameState, startNewContract } = useGame();
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState("");

  // Safety guard → don't render until state is populated
  if (!gameState?.currentContract?.id) return null;

  const { id, ticketsResolved, ticketsRequired } = gameState.currentContract;
  const completedContract = contractsData.find((c) => c.id === id);

  // Fallback if contract ID went missing (shouldn't happen)
  if (!completedContract) return null;

  const percent = Math.min(
    100,
    Math.round((ticketsResolved / ticketsRequired) * 100)
  );

  // Load random contracts on mount
  useEffect(() => {
    setContracts(getRandomContracts(contractsData, 3));
  }, []);

  /* ----- Handlers ----- */
  const handleContractSelect = (contractId) => {
    setSelectedContract(contractId);
  };

  const handleStartNewContract = () => {
    if (!selectedContract) return;
    const contract = contracts.find((c) => c.id === selectedContract);
    if (contract) {
      startNewContract(contract);
    }
  };

  const handleMainMenu = () => {
    // This will need to be implemented in useGame
    window.location.reload(); // Temporary solution
  };

  const readyToStart = selectedContract !== "";

  /* ----- UI ----- */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-200/90 p-4">
      <div className="card w-full max-w-4xl shadow-xl bg-base-100 max-h-[90vh] overflow-y-auto">
        <div className="card-body gap-6">
          <h2 className="card-title text-3xl">🎉 Contract Complete!</h2>

          {/* Completed Contract Summary */}
          <div className="card bg-base-200 p-4">
            <h3 className="font-bold text-lg mb-2">
              Completed: {completedContract.name}
            </h3>

            {/* Progress bar */}
            <div className="w-full bg-base-300 rounded-box h-3 mb-2">
              <div
                className="bg-primary h-3 rounded-box"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-sm text-right opacity-60">
              {ticketsResolved}/{ticketsRequired} tickets resolved
            </p>

            {/* Reward */}
            {completedContract.reward?.cash && (
              <div className="stats shadow mt-4">
                <div className="stat">
                  <div className="stat-title">Cash Earned</div>
                  <div className="stat-value">
                    ${completedContract.reward.cash.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* New Contract Selection */}
          <div>
            <h3 className="font-bold text-xl mb-4">
              Choose Your Next Contract
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contracts.map((contract) => (
                <div
                  key={contract.id}
                  className={`card p-4 cursor-pointer border transition-all duration-150 ${
                    selectedContract === contract.id
                      ? "border-primary ring-2 ring-primary"
                      : "border-base-200 hover:border-primary"
                  }`}
                  onClick={() => handleContractSelect(contract.id)}
                >
                  <div className="font-bold text-lg mb-1">{contract.name}</div>
                  <div className="text-xs mb-2">{contract.description}</div>
                  <div className="text-xs mb-1">
                    Tickets: {contract.ticketsRequired}
                  </div>
                  <div className="text-xs mb-1">
                    Reward: ${contract.reward.cash}
                  </div>
                  <div className="badge badge-warning">
                    Difficulty: {contract.baseChaos}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="card-actions justify-end pt-4">
            <button className="btn btn-secondary" onClick={handleMainMenu}>
              Main Menu
            </button>
            <button
              className="btn btn-primary"
              disabled={!readyToStart}
              onClick={handleStartNewContract}
            >
              {readyToStart
                ? "🚀 Start New Contract"
                : "Select a contract to continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractComplete;
