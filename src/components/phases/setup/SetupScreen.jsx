"use client";

import { useGame } from "@/context/useGame";
import { DEFAULT_STARTING_MONEY } from "@/lib/config/defaultGameState";
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

const getRerollCost = (base, count) => Math.floor(base * Math.pow(2, count));

function SetupScreen() {
  const [businessName, setBusinessName] = useState("Ctrl-Alt-Failure Inc.");
  const [selectedFounder, setSelectedFounder] = useState(
    DEFAULT_FOUNDERS[0].id
  );
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState("");
  const [agents, setAgents] = useState([]); // [{agent, rerollCount}]
  const [money, setMoney] = useState(DEFAULT_STARTING_MONEY);
  const [rerollCounts, setRerollCounts] = useState([0, 0, 0, 0]);

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
    setRerollCounts([0, 0, 0, 0]);
  };

  const handleReroll = (idx) => {
    const cost = getRerollCost(50, rerollCounts[idx]);
    if (money < cost) return;
    const newAgent = Object.values(generateNewAgents(1))[0];
    const newAgents = [...agents];
    newAgents[idx] = newAgent;
    setAgents(newAgents);
    const newCounts = [...rerollCounts];
    newCounts[idx] += 1;
    setRerollCounts(newCounts);
    setMoney(money - cost);
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
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* Business Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Business Name</label>
        <input
          className="input input-bordered w-full text-lg"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Ctrl-Alt-Failure Inc."
        />
      </div>

      {/* Founder Selection */}
      <div>
        <div className="mb-2 font-semibold">Choose Your Founder</div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {DEFAULT_FOUNDERS.map((f) => (
            <div
              key={f.id}
              className={`card w-56 p-4 cursor-pointer border transition-all duration-150 ${
                selectedFounder === f.id
                  ? "border-primary ring-2 ring-primary"
                  : "border-base-200 hover:border-primary"
              }`}
              onClick={() => setSelectedFounder(f.id)}
            >
              <div className="font-bold text-lg mb-1">{f.name}</div>
              <div className="text-xs italic mb-1">{f.tagline}</div>
              <div className="text-xs mb-1">Traits: {f.traits.join(", ")}</div>
              <div className="badge badge-info mt-2">{f.effect}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contract Selection */}
      <div>
        <div className="mb-2 font-semibold">Choose a Contract</div>
        <div className="flex gap-4">
          {contracts.map((c) => (
            <div
              key={c.id}
              className={`card w-64 p-4 cursor-pointer border transition-all duration-150 ${
                selectedContract === c.id
                  ? "border-primary ring-2 ring-primary"
                  : "border-base-200 hover:border-primary"
              }`}
              onClick={() => setSelectedContract(c.id)}
            >
              <div className="font-bold text-lg mb-1">{c.name}</div>
              <div className="text-xs mb-2">{c.description}</div>
              <div className="text-xs mb-1">Tickets: {c.ticketsRequired}</div>
              <div className="text-xs mb-1">Reward: ${c.reward.cash}</div>
              <div className="badge badge-warning">
                Difficulty: {c.baseChaos}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Roster */}
      <div>
        <div className="mb-2 font-semibold flex justify-between items-center">
          <span>Starting Agent Roster</span>
          <span className="badge badge-outline">💰 {money} left</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {agents.map((agent, idx) => (
            <div key={agent.id} className="card p-4 flex flex-col items-center">
              <img
                src={agent.profileImage}
                className="w-16 h-16 rounded-full mb-2 border border-base-300"
                alt={agent.agentName}
              />
              <div className="font-bold mb-1">{agent.agentName}</div>
              <div className="text-xs mb-1">
                {agent.personality.traits.join(", ")}
              </div>
              <div className="text-xs">Hardware: {agent.skills.hardware}</div>
              <div className="text-xs">Software: {agent.skills.software}</div>
              <button
                className="btn btn-xs btn-outline mt-2"
                disabled={money < getRerollCost(50, rerollCounts[idx])}
                onClick={() => handleReroll(idx)}
              >
                Reroll ({getRerollCost(50, rerollCounts[idx])})
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div className="sticky bottom-4 z-10">
        <button
          className="btn btn-primary btn-lg w-full transition-all"
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
