import { useGame } from "@/context/useGame";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

function MessageModal({ message, assignAndClose, onClose }) {
  const [selectedAgentID, setSelectedAgentID] = useState("");
  const { gameState } = useGame();
  const agentList = Object.values(gameState.agents);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      id="message_modal"
      className="modal modal-open bg-black/40 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="modal-box animate-modal-zoom max-w-xl bg-base-100 text-base-content border border-base-300 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold">{message.subject}</h2>
            <p className="text-sm text-base-content/60">
              From: <strong>{message.sender}</strong>
            </p>
            <p className="text-xs text-base-content/50 italic">
              {formatDistanceToNow(message.received, {
                includeSeconds: true,
                addSuffix: true,
              })}
            </p>
          </div>
          <button className="btn btn-sm btn-circle" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="prose max-w-none text-sm mb-4">
          <p>{message.body}</p>
        </div>

        <div className="flex flex-col gap-3 border-t border-base-300 pt-4">
          <label htmlFor="agent-list" className="text-sm font-semibold">
            Assign to:
          </label>
          <select
            name="agent-list"
            className="select select-sm select-bordered"
            value={selectedAgentID}
            onChange={(e) => setSelectedAgentID(e.target.value)}
          >
            <option disabled value="">
              Select Agent
            </option>
            {agentList.map((agent) => (
              <option
                key={agent.id}
                value={agent.id}
                disabled={agent.currentAction === "Working"}
              >
                {agent.agentName} ({agent.currentAction})
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            <button className="btn btn-error btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary btn-sm"
              disabled={!selectedAgentID}
              onClick={() => assignAndClose(selectedAgentID, message.id)}
            >
              Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageModal;
