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
    <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
      {agents.map((agent) => (
        <AgentProfileMini
          key={agent.id}
          agent={agent}
          onClick={() => openAgentModal(agent)}
        />
      ))}

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
