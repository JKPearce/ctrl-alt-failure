import { useState } from "react";
import AgentProfileFull from "./AgentProfileFull";
import AgentProfileMini from "./AgentProfileMini";

function AgentGrid({ agents }) {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openAgentModal = (agent) => {
    setSelectedAgent(agent);
    setModalOpen(true);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        {agents.map((agent) => (
          <AgentProfileMini
            key={agent.id}
            agent={agent}
            onClick={() => openAgentModal(agent)}
          />
        ))}
      </div>

      {modalOpen && selectedAgent && (
        <AgentProfileFull
          agent={selectedAgent}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

export default AgentGrid;
