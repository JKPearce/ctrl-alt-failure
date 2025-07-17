function AgentProfileMini({ agent, onClick }) {
  const moodColor =
    agent.moodScore <= -5
      ? "text-error"
      : agent.moodScore <= 2
      ? "text-warning"
      : "text-success";

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm hover:shadow-lg hover:scale-[1.03] transition-all duration-200 ease-out w-full flex flex-col gap-2 items-center text-center"
    >
      {agent.currentComment && (
        <div className="absolute -top-5 right-0 bg-base-100 text-xs px-3 py-2 rounded-lg shadow-xl border border-base-300 max-w-[200px] z-50 animate-agent-pop">
          “{agent.currentComment}”
        </div>
      )}

      {/* Avatar */}
      <div className="avatar">
        <div className="w-20 mask mask-squircle">
          <img
            src={`/images/agents/${agent.agentName}_${
              agent.currentEmotion || "neutral"
            }.png`}
            alt={agent.agentName}
          />
        </div>
      </div>

      {/* Name + Status */}
      <div>
        <h3 className="font-bold text-sm">{agent.nickName}</h3>
        <p className="text-xs text-base-content/60 italic">
          {agent.currentAction}
        </p>
      </div>

      {/* Traits */}
      <div className="flex flex-wrap justify-center gap-1">
        {agent.personality.traits.slice(0, 2).map((trait, i) => (
          <span key={i} className="badge badge-warning badge-xs" title={trait}>
            {trait}
          </span>
        ))}
      </div>

      {/* Mood Score */}
      <div className="text-xs text-base-content/70">
        Mood:{" "}
        <span className={`font-bold ${moodColor}`}>{agent.moodScore}</span>
      </div>
    </div>
  );
}

export default AgentProfileMini;
