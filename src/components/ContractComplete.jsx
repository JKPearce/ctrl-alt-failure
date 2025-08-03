"use client";

import contractsData from "@/lib/data/contracts.json";
import { useEffect, useState } from "react";

const getRandomContracts = (contracts, n = 3) => {
  const shuffled = [...contracts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

const ContractComplete = ({ startNewContract, gameState }) => {
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
                  className={`card p-5 cursor-pointer border-2 transition-all duration-200 hover:shadow-md relative group ${
                    selectedContract === contract.id
                      ? "border-primary bg-primary/5"
                      : "border-base-300 hover:border-primary/50"
                  }`}
                  onClick={() => handleContractSelect(contract.id)}
                >
                  {/* Company Header */}
                  <div className="mb-3">
                    <h3 className="font-bold text-lg text-base-content mb-1">
                      {contract.companyName}
                    </h3>
                    <span className="text-sm text-base-content/60 uppercase tracking-wide">
                      {contract.industry}
                    </span>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <div className="text-lg font-semibold">
                        {contract.ticketsRequired}
                      </div>
                      <div className="text-xs text-base-content/60">
                        Tickets Required
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-success">
                        ${contract.reward.cash}
                      </div>
                      <div className="text-xs text-base-content/60">Reward</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-warning">
                        {contract.baseChaos}
                      </div>
                      <div className="text-xs text-base-content/60">
                        Chaos Level
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">
                        {contract.baseInboxSize}
                      </div>
                      <div className="text-xs text-base-content/60">
                        Daily Tickets
                      </div>
                    </div>
                  </div>

                  {/* Hover for description */}
                  <div className="text-sm text-base-content/50 cursor-help">
                    Hover for details...
                  </div>

                  {/* Description Tooltip */}
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-base-100 border-2 border-primary rounded-lg p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-10 shadow-lg">
                    <h3 className="font-bold text-lg mb-2">
                      {contract.companyName}
                    </h3>
                    <p className="text-sm text-base-content/80 mb-3">
                      {contract.companyDescription}
                    </p>
                    <div className="text-xs text-base-content/60">
                      <div className="mb-1">
                        <span className="font-semibold">Culture:</span>{" "}
                        {contract.companyCulture}
                      </div>
                      <div>
                        <span className="font-semibold">Users:</span>{" "}
                        {contract.companyUserType}
                      </div>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedContract === contract.id && (
                    <div className="mt-3 text-center">
                      <span className="badge badge-primary">Selected</span>
                    </div>
                  )}
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
