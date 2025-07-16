function AgentCard({ agent }) {
  return (
    <div className="card bg-base-100 shadow-md border border-base-300 w-full max-w-sm">
      <div className="card-body">
        <h2 className="card-title">{agent.agentName}</h2>
        <p className="text-sm text-neutral-content italic mb-2">
          {agent.personality}
        </p>
        <div className="grid grid-cols-2 text-sm gap-y-1">
          <span className="font-semibold">Age:</span>
          <span>{agent.age}</span>

          <span className="font-semibold">Skill Level:</span>
          <span>{agent.skillLevel}</span>
        </div>
      </div>
    </div>
  );
}

export default AgentCard;
