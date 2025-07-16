import { useGame } from "@/lib/hooks/useGame";
import { useState } from "react";

function InboxMessageCard({ message, agentList }) {
  const [selectedAgentID, setSelectedAgentID] = useState("");
  const { assignTicketToAgent } = useGame();

  return (
    <div className="card bg-base-100 shadow-md border border-base-300 w-full max-w-xl">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg">{message.subject}</h2>
            <p className="text-sm text-neutral-content">
              From: {message.sender}
            </p>
          </div>
          <p className="text-xs text-right text-neutral-content whitespace-nowrap">
            {message.received}
          </p>
        </div>

        <p className="mt-2 whitespace-pre-line text-sm">{message.body}</p>

        <select
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
          onClick={() => assignTicketToAgent(message.id, selectedAgentID)}
        >
          Assign
        </button>
      </div>
    </div>
  );
}

export default InboxMessageCard;
