import AgentProfileMini from "./AgentProfileMini";

function AgentGrid({ agents }) {
  const openAgentModal = () => {
    console.log("modal click");
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
    </div>
  );
}

export default AgentGrid;
