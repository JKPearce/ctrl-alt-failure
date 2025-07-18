import Image from "next/image";
import { useEffect } from "react";

function AgentProfileFull({ agent, onClose }) {
  // 🔐 Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  console.log("AgentProfileFull received agent:", agent);
  console.log("agent.skills:", agent.skills);

  return (
    <div className="modal modal-open z-50">
      <div className="modal-box animate-modal-zoom max-w-4xl h-[90vh] overflow-hidden flex flex-col bg-base-200 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">{agent.agentName}</h2>
            <p className="italic text-base-content/70">
              "{agent.nickName}" — Age {agent.age}
            </p>
          </div>
          <button className="btn btn-sm btn-circle" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 flex-grow overflow-hidden">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <Image
              src={`/images/agents/${agent.gender}_${agent.ageBracket} (${agent.id}).png`}
              alt={agent.agentName}
              width={128}
              height={128}
              className="rounded-xl border border-base-300"
            />
            <div className="mt-2 text-sm italic text-warning">
              {agent.currentAction} / {agent.currentEmotion}
            </div>
            <div className="text-xs text-error">Mood: {agent.moodScore}</div>
          </div>

          {/* Info Panel */}
          <div className="flex flex-col gap-4 overflow-y-auto pr-2">
            {/* Personal Statement */}
            <div>
              <h3 className="text-lg font-semibold mb-1">Personal Statement</h3>
              <p className="text-sm text-base-content/80">
                "{agent.personalStatement}"
              </p>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-lg font-semibold mb-1">Skills</h3>
              <ul className="text-sm grid grid-cols-3 gap-2">
                {Object.entries(agent.skills).map(([skill, value]) => (
                  <li key={skill} className="flex justify-between">
                    <span className="capitalize">{skill}</span>
                    <span className="font-bold">{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Personality */}
            <div>
              <h3 className="text-lg font-semibold mb-1">Personality</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium">Traits:</p>
                  <ul className="list-disc list-inside text-base-content/70">
                    {agent.personality.traits.map((trait, i) => (
                      <li key={i}>{trait}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Quirks:</p>
                  <ul className="list-disc list-inside text-base-content/70">
                    {agent.personality.quirks.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Likes:</p>
                  <ul className="list-disc list-inside text-base-content/70">
                    {agent.personality.likes.map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Dislikes:</p>
                  <ul className="list-disc list-inside text-base-content/70">
                    {agent.personality.dislikes.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Memory Log */}
            <div>
              <h3 className="text-lg font-semibold mb-1">Memory Log</h3>
              <div className="h-28 overflow-y-auto bg-base-100 rounded p-2 border border-base-300 text-sm space-y-1">
                {agent.memoryLog.map((entry, i) => (
                  <p key={i}>- {entry}</p>
                ))}
              </div>
            </div>

            {/* Current Comment */}
            {agent.currentComment && (
              <div>
                <h3 className="text-lg font-semibold mb-1">Current Comment</h3>
                <div className="bg-base-100 border border-base-300 rounded p-2 text-sm">
                  "{agent.currentComment}"
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentProfileFull;
