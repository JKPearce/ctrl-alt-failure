import React from "react";

function AgentCard({ agent }) {
  const {
    agentName,
    nickName,
    age,
    personality,
    skills,
    currentEmotion,
    personalStatement,
  } = agent;

  return (
    <div className="relative card card-border rounded-xl bg-base-100 shadow-xl border-primary transition-all duration-200 hover:scale-105 hover:shadow-2xl overflow-hidden">
      <div className="card-body relative z-10">
        {/* Header */}
        <h2 className="card-title">
          {agentName}
          <span className="badge badge-secondary text-xs ml-2">{nickName}</span>
        </h2>
        <p className="text-sm italic text-base-content/60">
          Age: {age} | Emotion: {currentEmotion}
        </p>

        {/* Traits */}
        <div className="mt-2">
          <h3 className="font-semibold">Traits</h3>
          <div className="flex flex-wrap gap-1">
            {personality.traits.map((trait, idx) => (
              <span key={idx} className="badge badge-outline badge-sm">
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Skills Section with Background Image */}
        <div className="mt-4 relative rounded-lg overflow-hidden border border-base-300">
          <img
            src="/images/agents/terry.png"
            alt={agentName}
            className="absolute inset-0 w-full h-full object-cover "
            style={{
              maskImage: "linear-gradient(to left, black 80%, transparent 20%)",
              WebkitMaskImage:
                "linear-gradient(to left, black 80%, transparent 20%)",
            }}
          />
          <div className="absolute inset-0 bg-base-100/60"></div>

          <div className="relative z-10 p-4">
            <h3 className="font-semibold">Skills</h3>
            <div className="stats stats-vertical">
              {Object.entries(skills).map(([key, val]) => (
                <div key={key} className="stat">
                  <div className="stat-title capitalize">{key}</div>
                  <div className="stat-value text-primary">{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Personal Statement */}
        {personalStatement && (
          <div className="mt-4">
            <p className="text-sm text-base-content/80 border-t pt-2 italic">
              “{personalStatement}”
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AgentCard;
