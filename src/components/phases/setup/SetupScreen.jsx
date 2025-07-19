"use client";

import AgentPicker from "@/components/drafting/AgentPicker";
import ContractPicker from "@/components/drafting/ContractPicker";
import { useGame } from "@/context/useGame";
import { useEffect, useState } from "react";
import CompanyCreator from "./CompanyCreator";

function SetupScreen() {
  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [selectedFounder, setSelectedFounder] = useState("");
  const [selectedContract, setSelectedContract] = useState("");
  const [selectedAgents, setSelectedAgents] = useState([]);

  const { startGame } = useGame();

  const readyToStart =
    businessName &&
    selectedFounder &&
    selectedContract &&
    selectedAgents.length > 0;

  useEffect(() => {
    if (step === 1 && selectedContract) setStep(2);
  }, [selectedContract, step]);

  const handleStart = () => {
    if (!readyToStart) return;
    startGame(businessName, selectedFounder, selectedContract, selectedAgents);
  };

  const handleNextFromCompany = () => {
    if (businessName && selectedFounder) setStep(1);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <ul className="steps w-full">
        <li className={`step ${step >= 0 ? "step-primary" : ""}`}>Company</li>
        <li className={`step ${step >= 1 ? "step-primary" : ""}`}>Contract</li>
        <li className={`step ${step >= 2 ? "step-primary" : ""}`}>Agents</li>
      </ul>

      {step === 0 && (
        <div className="card bg-base-200 shadow-xl animate-agent-pop">
          <div className="card-body space-y-4">
            <h2 className="card-title text-2xl">🧑‍💼 Name Your Company</h2>
            <CompanyCreator
              businessName={businessName}
              setBusinessName={setBusinessName}
              selectedFounder={selectedFounder}
              setSelectedFounder={setSelectedFounder}
            />
            <div className="flex justify-end pt-4">
              <button
                className="btn btn-primary"
                disabled={!businessName || !selectedFounder}
                onClick={handleNextFromCompany}
              >
                Next ➡
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="card bg-base-200 shadow-xl animate-agent-pop">
          <div className="card-body space-y-4">
            <ContractPicker
              value={selectedContract}
              onChange={setSelectedContract}
            />
            <div className="flex justify-start pt-4">
              <button className="btn btn-outline" onClick={() => setStep(0)}>
                ⬅ Back
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card bg-base-200 shadow-xl animate-agent-pop">
          <div className="card-body space-y-4">
            <AgentPicker
              value={selectedAgents}
              onChange={setSelectedAgents}
              maxSelect={2}
              generateAmount={5}
            />
            <div className="flex justify-between pt-4">
              <button className="btn btn-outline" onClick={() => setStep(1)}>
                ⬅ Back
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="sticky bottom-4 animate-agent-pop">
          <button
            className="btn btn-primary btn-lg w-full transition-all"
            disabled={!readyToStart}
            onClick={handleStart}
          >
            {readyToStart
              ? "🚀 Start Game"
              : "Complete all setup steps to begin"}
          </button>
        </div>
      )}
    </div>
  );
}

export default SetupScreen;
