"use client";

import { useGame } from "@/context/useGame";
import contractsData from "@/lib/data/contracts.json";
import { generateNewAgents } from "@/lib/helpers/agentHelpers";
import React, { useEffect, useState } from "react";

const DEFAULT_FOUNDERS = [
  {
    id: "founder_nullman",
    name: "Bob Nullman",
    tagline: "Nothing to lose, nothing to gain.",
    traits: ["balanced", "coffee snob"],
    effect: "Start with +1 energy",
  },
  {
    id: "founder_blitz",
    name: "Sandra Blitz",
    tagline: "Speed is efficiency. Efficiency is life.",
    traits: ["fast resolver", "high pressure"],
    effect: "Agents start with +1 to all skills",
  },
];

const getRandomContracts = (contracts, n = 3) => {
  const shuffled = [...contracts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

function SetupScreen() {
  const [businessName, setBusinessName] = useState("Ctrl-Alt-Failure Inc.");
  const [selectedFounder, setSelectedFounder] = useState(
    DEFAULT_FOUNDERS[0].id
  );
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState("");
  const [agents, setAgents] = useState([]);

  const { startGame } = useGame();

  // On mount, pick contracts and generate agents
  useEffect(() => {
    setContracts(getRandomContracts(contractsData, 3));
    setSelectedContract("");
    rerollAllAgents();
    // eslint-disable-next-line
  }, []);

  const rerollAllAgents = () => {
    const newAgents = Object.values(generateNewAgents(4));
    setAgents(newAgents);
  };

  const handleReroll = (idx) => {
    const newAgent = Object.values(generateNewAgents(1))[0];
    const newAgents = [...agents];
    newAgents[idx] = newAgent;
    setAgents(newAgents);
  };

  const readyToStart =
    businessName && selectedFounder && selectedContract && agents.length === 4;

  const handleStart = () => {
    if (!readyToStart) return;
    startGame(
      businessName,
      DEFAULT_FOUNDERS.find((f) => f.id === selectedFounder),
      contracts.find((c) => c.id === selectedContract),
      agents
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      {/* Business Name */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-base-content">
          Business Name
        </h2>
        <input
          className="input input-bordered w-full text-xl py-4 px-4 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Ctrl-Alt-Failure Inc."
        />
      </div>

      {/* Founder Selection */}
      <div>
        <div className="mb-4 font-semibold text-lg">Choose Your Founder</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEFAULT_FOUNDERS.map((f) => (
            <div
              key={f.id}
              className={`card p-5 cursor-pointer border-2 transition-all duration-200 hover:shadow-md ${
                selectedFounder === f.id
                  ? "border-primary bg-primary/5"
                  : "border-base-300 hover:border-primary/50"
              }`}
              onClick={() => setSelectedFounder(f.id)}
            >
              {/* Founder Header */}
              <div className="mb-3">
                <h3 className="font-bold text-lg text-base-content mb-1">
                  {f.name}
                </h3>
                <p className="text-sm text-base-content/60 italic">
                  {f.tagline}
                </p>
              </div>

              {/* Traits */}
              <div className="mb-3">
                <div className="text-sm text-base-content/70">
                  <span className="font-medium">Traits:</span>{" "}
                  {f.traits.join(", ")}
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedFounder === f.id && (
                <div className="mt-3 text-center">
                  <span className="badge badge-primary">Selected</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contract Selection */}
      <div>
        <div className="mb-4 font-semibold text-lg">Choose a Contract</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contracts.map((c) => (
            <div
              key={c.id}
              className={`card p-5 cursor-pointer border-2 transition-all duration-200 hover:shadow-md relative group ${
                selectedContract === c.id
                  ? "border-primary bg-primary/5"
                  : "border-base-300 hover:border-primary/50"
              }`}
              onClick={() => setSelectedContract(c.id)}
            >
              {/* Company Header */}
              <div className="mb-3">
                <h3 className="font-bold text-lg text-base-content mb-1">
                  {c.companyName}
                </h3>
                <span className="text-sm text-base-content/60 uppercase tracking-wide">
                  {c.industry}
                </span>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-lg font-semibold">
                    {c.ticketsRequired}
                  </div>
                  <div className="text-xs text-base-content/60">
                    Tickets Required
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-success">
                    ${c.reward.cash}
                  </div>
                  <div className="text-xs text-base-content/60">Reward</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-warning">
                    {c.baseChaos}
                  </div>
                  <div className="text-xs text-base-content/60">
                    Chaos Level
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{c.baseInboxSize}</div>
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
                <h3 className="font-bold text-lg mb-2">{c.companyName}</h3>
                <p className="text-sm text-base-content/80 mb-3">
                  {c.companyDescription}
                </p>
                <div className="text-xs text-base-content/60">
                  <div className="mb-1">
                    <span className="font-semibold">Culture:</span>{" "}
                    {c.companyCulture}
                  </div>
                  <div>
                    <span className="font-semibold">Users:</span>{" "}
                    {c.companyUserType}
                  </div>
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedContract === c.id && (
                <div className="mt-3 text-center">
                  <span className="badge badge-primary">Selected</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Agent Roster */}
      <div>
        <div className="mb-4 font-semibold text-lg flex justify-between items-center">
          <span>Starting Agent Roster</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent, idx) => (
            <div
              key={agent.id}
              className="card p-4 border-2 border-base-300 hover:border-primary/50 hover:shadow-md transition-all duration-200"
            >
              {/* Agent Header */}
              <div className="flex flex-col items-center mb-3">
                <img
                  src={agent.profileImage}
                  className="w-16 h-16 rounded-full mb-2 border-2 border-base-300"
                  alt={agent.agentName}
                />
                <h4 className="font-bold text-base text-center">
                  {agent.agentName}
                </h4>
              </div>

              {/* Skills */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {agent.skills.hardware}
                  </div>
                  <div className="text-xs text-base-content/60">Hardware</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {agent.skills.software}
                  </div>
                  <div className="text-xs text-base-content/60">Software</div>
                </div>
              </div>

              {/* Traits */}
              <div className="text-xs text-base-content/70 text-center mb-3 line-clamp-2">
                {agent.personality}
              </div>
              <div className="text-xs text-base-content/70 text-center mb-3 line-clamp-2">
                {agent.behavior}
              </div>
              <div className="text-xs text-base-content/70 text-center mb-3 line-clamp-2">
                {agent.quirk}
              </div>
              <div className="text-xs text-base-content/70 text-center mb-3 line-clamp-2">
                {agent.favFood}
              </div>

              {/* Reroll Button */}
              <button
                className="btn btn-sm btn-outline w-full"
                onClick={() => handleReroll(idx)}
              >
                Reroll
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div className="sticky bottom-6 z-10 pt-4 bg-gradient-to-t from-base-100 via-base-100 to-transparent">
        <button
          className="btn btn-primary btn-lg w-full text-lg py-4 shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
          disabled={!readyToStart}
          onClick={handleStart}
        >
          {readyToStart ? "🚀 Start Game" : "Complete all setup steps to begin"}
        </button>
      </div>
    </div>
  );
}

export default SetupScreen;
