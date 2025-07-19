// AgentProfileFull.jsx — refactored for visual hierarchy and theme

import Image from "next/image";
import { useEffect } from "react";

function AgentProfileFull({ agent, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="modal modal-open z-50">
      <div className="modal-box animate-modal-zoom max-w-4xl h-[90vh] overflow-hidden flex flex-col bg-base-100 text-base-content border border-base-300 shadow-xl">
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

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 flex-grow overflow-hidden">
          {/* Left panel */}
          <div className="flex flex-col items-center">
            <Image
              src={agent.profileImage}
              alt={`${agent.agentName} profile`}
              width={128}
              height={128}
              className="rounded-xl border border-base-300"
            />
            <div className="mt-2 text-sm italic text-warning">
              {agent.currentAction} / {agent.currentEmotion}
            </div>
            <div className="text-xs text-error">Mood: {agent.moodScore}</div>
          </div>

          {/* Info panel */}
          <div className="flex flex-col gap-4 overflow-y-auto pr-2">
            <div>
              <h3 className="text-lg font-semibold mb-1">Personal Statement</h3>
              <p className="text-sm text-base-content/80">
                "{agent.personalStatement}"
              </p>
            </div>

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

            <div>
              <h3 className="text-lg font-semibold mb-1">Personality</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ["Traits", agent.personality.traits],
                  ["Quirks", agent.personality.quirks],
                  ["Likes", agent.personality.likes],
                  ["Dislikes", agent.personality.dislikes],
                ].map(([label, list]) => (
                  <div key={label}>
                    <p className="font-medium">{label}:</p>
                    <ul className="list-disc list-inside text-base-content/70">
                      {list.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1">Memory Log</h3>
              <div className="h-28 overflow-y-auto bg-base-200 rounded p-2 border border-base-300 text-sm space-y-1">
                {agent.memoryLog.map((entry, i) => (
                  <p key={i}>- {entry}</p>
                ))}
              </div>
            </div>

            {agent.currentComment && (
              <div>
                <h3 className="text-lg font-semibold mb-1">Current Comment</h3>
                <div className="bg-base-200 border border-base-300 rounded p-2 text-sm">
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
