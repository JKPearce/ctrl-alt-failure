import { useGame } from "@/lib/hooks/useGame";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

function MessageModal({ message, assignAndClose, onClose }) {
  const [selectedAgentID, setSelectedAgentID] = useState();
  const { gameState } = useGame();
  const agentList = Object.values(gameState.agents);

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

  return (
    <div id="message_modal" className="modal modal-open" onClick={onClose}>
      <div
        className="modal-box relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>

        <h2>{message.from}</h2>
        <h2 className="font-bold text-lg">From: {message.sender}</h2>
        <h2 className="font-bold text-lg">
          Received:{" "}
          {formatDistanceToNow(message.received, {
            includeSeconds: true,
            addSuffix: true,
          })}
        </h2>

        <p className="py-4">{message.body}</p>

        <div className="modal-action">
          <button className="btn btn-sm btn-error" onClick={onClose}>
            Cancel
          </button>
          <label htmlFor="agent-list">Assign to:</label>
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
                disabled={agent.assignedTicket !== null}
              >
                {agent.agentName} ({agent.currentAction})
              </option>
            ))}
          </select>

          <button
            className="btn btn-sm btn-primary mt-2"
            onClick={() => assignAndClose(selectedAgentID)}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageModal;
