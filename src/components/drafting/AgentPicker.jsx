"use client";

import { generateNewAgents } from "@/lib/helpers/agentHelpers";
import Image from "next/image";
import { useEffect, useState } from "react";

const AgentPicker = ({
  maxSelect = 1,
  generateAmount = 3,
  value = [],
  onChange,
  agentList = null,
  title = "🧑‍💻 Hire Your Starting Agents",
  description = "Choose agents to join your helpdesk dream team.",
}) => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    if (agentList) {
      setAgents(agentList);
    } else {
      const newAgents = Object.values(generateNewAgents(generateAmount));
      setAgents(newAgents);
    }
  }, [agentList, generateAmount]);

  const toggleSelect = (id) => {
    let updated;

    if (value.some((a) => a.id === id)) {
      updated = value.filter((a) => a.id !== id);
    } else if (value.length < maxSelect) {
      const agentToAdd = agents.find((a) => a.id === id);
      updated = [...value, agentToAdd];
    } else {
      return;
    }

    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-sm opacity-70">{description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const isSelected = value.some((a) => a.id === agent.id);
          return (
            <div
              key={agent.id}
              onClick={() => toggleSelect(agent.id)}
              className={`card cursor-pointer transition border ${
                isSelected
                  ? "border-primary bg-primary text-primary-content"
                  : "border-base-300 bg-base-200"
              }`}
            >
              <div className="card-body">
                {agent.profileImage && (
                  <div className="w-full flex justify-center mb-4">
                    <Image
                      src={agent.profileImage}
                      alt={`${agent.agentName} profile`}
                      width={96}
                      height={96}
                      className="rounded-xl h-24 object-contain"
                    />
                  </div>
                )}
                <h2 className="card-title">{agent.agentName}</h2>
                <p className="text-sm italic opacity-70">"{agent.nickName}"</p>

                <div className="text-sm mt-2 space-y-1">
                  <div>
                    <strong>Hardware:</strong> {agent.skills.hardware}
                  </div>
                  <div>
                    <strong>Software:</strong> {agent.skills.software}
                  </div>
                  <div>
                    <strong>People:</strong> {agent.skills.people}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentPicker;
