import { formatGameTime } from "@/lib/helpers/gameHelpers";
import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useMemo, useState } from "react";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Tickets", value: "ticket" },
  { label: "Spam", value: "spam" },
  { label: "Complaints", value: "complaint" },
];

function getTypeBadge(type, difficulty, small = false) {
  const base = small
    ? "badge font-semibold text-[10px] px-1 py-0.5 mr-2"
    : "badge font-semibold text-xs px-2 py-1 mr-3";
  if (type === "hardware") {
    return (
      <span className={`badge-primary ${base}`}>HW {difficulty}</span>
    );
  }
  if (type === "software") {
    return <span className={`badge-info ${base}`}>SW {difficulty}</span>;
  }
  return null;
}

const InboxScreen = ({ gameState, assignTicketToAgent, deleteSpam }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("all");

  const agents = useMemo(() => Object.values(gameState.agents), [gameState.agents]);

  // Items filtered and sorted
  let inboxItems = Object.values(gameState.inbox).filter((item) => item.activeItem);
  if (filter !== "all") {
    inboxItems = inboxItems.filter((item) => item.messageType === filter);
  }
  inboxItems = inboxItems.sort((a, b) => b.receivedTime - a.receivedTime);

  const activeCount = Object.values(gameState.inbox).filter((i) => i.activeItem).length;
  const inboxSize = gameState.inboxSize;

  const getBestAgentId = (ticket) => {
    const available = agents.filter((a) => !a.assignedTicketId);
    if (available.length === 0) return null;
    const sorted = available.sort(
      (a, b) => b.skills[ticket.ticketType] - a.skills[ticket.ticketType]
    );
    return sorted[0]?.id || null;
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Inbox Header */}
      <div className="mb-2">
        <div className="flex items-center justify-between border rounded px-4 py-2 bg-base-100">
          <span className="font-bold text-lg">
            Inbox
            <span className="text-base-content/50 font-normal"> {activeCount} / {inboxSize}</span>
          </span>
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                className={`btn btn-xs btn-ghost ${filter === f.value ? "bg-base-200 font-bold" : ""}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Column headers for readability */}
      <div className="px-4 py-1 text-[11px] uppercase tracking-wide text-base-content/50 hidden sm:grid grid-cols-[1fr_auto]">
        <div>From • Subject</div>
        <div className="text-right">Received</div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {inboxItems.length === 0 && (
          <div className="text-center text-base-content/60 py-8">No messages found.</div>
        )}
        <ul>
          {inboxItems.map((item) => {
            const isNew = gameState.dayNumber === item.receivedDay;
            const isExpanded = expandedId === item.id;
            const isTicket = item.messageType === "ticket";
            const isSpam = item.messageType === "spam";
            const isComplaint = item.messageType === "complaint";
            let typeBadge = null;
            if (isTicket) {
              typeBadge = getTypeBadge(item.ticketType, item.difficulty, true);
            }

            return (
              <React.Fragment key={item.id}>
                <li
                  className={
                    `group px-4 py-3 cursor-pointer grid grid-cols-[1fr_auto] gap-3 items-center ` +
                    `${isNew ? "bg-base-300/40" : "bg-base-100"} ` +
                    `hover:bg-base-200 transition border-b border-base-200 last:border-b-0`
                  }
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* message type chip */}
                      <span className={`badge badge-outline badge-sm ${isTicket ? "badge-primary" : isSpam ? "badge-error" : "badge-warning"}`}>
                        {isTicket ? "Ticket" : isSpam ? "Spam" : "Complaint"}
                      </span>
                      {typeBadge}
                      <span className="font-semibold truncate">{item.sender}</span>
                      <span className="truncate text-base-content/80">— {item.subject}</span>
                    </div>
                    <div className="text-xs text-base-content/60 truncate">
                      {item.body.length > 90 ? item.body.slice(0, 90) + "..." : item.body}
                    </div>
                  </div>
                  <div className="text-right text-xs text-base-content/60 flex items-center justify-end gap-2">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <span>{`Day ${item.receivedDay} ${formatGameTime(item.receivedTime)}`}</span>
                  </div>
                </li>

                {isExpanded && (
                  <div className="px-12 py-4 bg-base-200 border-b border-base-300">
                    <div className="mb-2">
                      <div className="font-bold text-base mb-1">{item.subject}</div>
                      <div className="text-sm text-base-content/60 mb-2">
                        From: <span className="font-semibold">{item.sender}</span>
                      </div>
                      {isTicket && (
                        <div className="flex items-center gap-2 mb-2">{getTypeBadge(item.ticketType, item.difficulty)}</div>
                      )}
                      <div className="text-sm whitespace-pre-line mb-3">{item.body}</div>
                    </div>

                    {isTicket && (
                      <div className="flex items-center gap-3">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            const best = getBestAgentId(item);
                            if (best) assignTicketToAgent(item.id, best);
                          }}
                          disabled={agents.filter((a) => !a.assignedTicketId).length === 0}
                        >
                          Assign Best
                        </button>
                        <span className="text-xs text-base-content/60">or pick manually:</span>
                      </div>
                    )}

                    {isTicket && (
                      <div className="mt-3">
                        <div className="font-semibold text-xs mb-2">Assign to Agent</div>
                        <div className="flex flex-col gap-2">
                          {agents
                            .sort((a, b) => b.skills[item.ticketType] - a.skills[item.ticketType])
                            .filter((agent) => {
                              return !agent.assignedTicketId;
                            })
                            .map((agent) => {
                              const agentSkill = agent.skills[item.ticketType];
                              const isGood = agentSkill >= item.difficulty;

                              return (
                                <div key={agent.id} className={`flex items-center gap-4 p-2 rounded ${isGood ? "bg-success/10" : "bg-base-100"}`}>
                                  <div className="avatar">
                                    <div className="w-8 rounded-full bg-base-300">
                                      <img src={agent.profileImage} alt={agent.agentName} />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold truncate">{agent.agentName}</div>
                                    <div className="text-xs text-base-content/60">
                                      {item.ticketType.charAt(0).toUpperCase() + item.ticketType.slice(1)} skill: <span className={`font-bold ${isGood ? "text-success" : "text-base-content"}`}>{agentSkill}</span>
                                      {"  |  "}Ticket difficulty: <span className="font-bold">{item.difficulty}</span>
                                    </div>
                                  </div>
                                  <button className={`btn btn-xs`} onClick={() => assignTicketToAgent(item.id, agent.id)}>
                                    Assign
                                  </button>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {!isTicket && (
                      <div className="mt-2">
                        <button className="btn btn-xs btn-outline btn-error" onClick={() => deleteSpam(item.id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default InboxScreen;
