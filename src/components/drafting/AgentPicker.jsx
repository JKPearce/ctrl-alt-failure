import { generateNewAgents } from "@/lib/helpers/agentHelpers";
import { useState } from "react";

const AgentPicker = ({ maxSelect = 2, onNext, setSelectedAgents }) => {
  const [selectedIDs, setSelectedIDs] = useState([]);
  const [agents] = useState(() => Object.values(generateNewAgents(3)));

  const toggleSelect = (id) => {
    if (selectedIDs.includes(id)) {
      setSelectedIDs(selectedIDs.filter((x) => x !== id));
    } else if (selectedIDs.length < maxSelect) {
      setSelectedIDs([...selectedIDs, id]);
    }
  };

  const handleNext = () => {
    const selected = selectedIDs.map((id) => agents.find((a) => a.id === id));
    setSelectedAgents(selected);
    onNext();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">🧑‍💻 Hire Your Starting Agents</h1>
      <p className="text-sm opacity-70">
        Choose {maxSelect} agents to join your helpdesk dream team.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            onClick={() => toggleSelect(agent.id)}
            className={`card cursor-pointer transition border ${
              selectedIDs.includes(agent.id)
                ? "border-primary bg-primary text-primary-content"
                : "border-base-300 bg-base-200"
            }`}
          >
            <div className="card-body">
              <h2 className="card-title">{agent.agentName}</h2>
              <p className="text-sm italic opacity-70">"{agent.nickName}"</p>

              <div className="text-sm mt-2">
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

              <div className="mt-2 text-xs opacity-70">
                {agent.personality.quirks[0]}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 text-right">
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={selectedIDs.length !== maxSelect}
        >
          Start Run →
        </button>
      </div>
    </div>
  );
};

export default AgentPicker;
