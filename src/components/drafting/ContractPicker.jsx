"use client";

import { useState } from "react";

const DEFAULT_CONTRACTS = [
  {
    id: "crusttech",
    name: "CrustTech Ltd.",
    theme: "Cyberpunk Office",
    modifier: "+1 spam per turn",
    goal: "Resolve 12 tickets",
    flavor: "Where neon lights blind you and so does the bureaucracy.",
  },
  {
    id: "harmonycoop",
    name: "Harmony Co-op",
    theme: "Wellness Startup",
    modifier: "+1 complaint per turn",
    goal: "Resolve 15 tickets",
    flavor: "They burn sage, not servers. Too bad the network’s always down.",
  },
  {
    id: "dungeoninc",
    name: "Dungeon, Inc.",
    theme: "Fantasy RPG Company",
    modifier: "25% chance of dangerous ticket",
    goal: "Resolve 20 tickets",
    flavor: "When dragons eat the routers, you're the chosen one.",
  },
];

const ContractPicker = ({ onNext, setSelectedContract }) => {
  const [selected, setSelected] = useState(null);

  const handleNext = () => {
    if (!selected) return;
    setSelectedContract(selected);
    onNext();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">📑 Choose a Starting Contract</h1>
      <p className="text-sm opacity-70">
        Each contract changes how your run plays — with unique ticket styles and
        gameplay modifiers.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DEFAULT_CONTRACTS.map((contract) => (
          <div
            key={contract.id}
            className={`card cursor-pointer transition ${
              selected?.id === contract.id
                ? "bg-secondary text-secondary-content"
                : "bg-base-200"
            }`}
            onClick={() => setSelected(contract)}
          >
            <div className="card-body">
              <h2 className="card-title">{contract.name}</h2>
              <p className="text-sm italic">{contract.theme}</p>
              <p className="text-sm mt-2">{contract.flavor}</p>
              <ul className="text-xs mt-2 space-y-1">
                <li>
                  <strong>Modifier:</strong> {contract.modifier}
                </li>
                <li>
                  <strong>Goal:</strong> {contract.goal}
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 text-right">
        <button
          onClick={handleNext}
          className="btn btn-primary"
          disabled={!selected}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default ContractPicker;
