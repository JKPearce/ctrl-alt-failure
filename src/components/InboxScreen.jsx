import { useGame } from "@/context/useGame";
import { formatGameTime } from "@/lib/helpers/gameHelpers";
import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useState } from "react";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Tickets", value: "ticket" },
  { label: "Spam", value: "spam" },
  { label: "Complaints", value: "complaint" },
];

function getTypeBadge(type, difficulty, small = false) {
  const base = small
    ? "badge font-semibold text-xs px-1 py-0.5 mr-2"
    : "badge font-semibold text-xs px-2 py-1 mr-3";
  if (type === "hardware") {
    return (
      <span className={`badge-primary ${base}`}>Hardware {difficulty}</span>
    );
  }
  if (type === "software") {
    return <span className={`badge-info ${base}`}>Software {difficulty}</span>;
  }
  return null;
}

const InboxScreen = () => {
  const { gameState, assignTicketToAgent, deleteSpam } = useGame();
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("all");

  // Only show active items
  let inboxItems = Object.values(gameState.inbox).filter(
    (item) => item.activeItem
  );
  if (filter !== "all") {
    inboxItems = inboxItems.filter((item) => item.messageType === filter);
  }
  // Sort by received time, newest first
  inboxItems = inboxItems.sort((a, b) => b.receivedTime - a.receivedTime);

  const agents = Object.values(gameState.agents);
  const activeCount = Object.values(gameState.inbox).filter(
    (item) => item.activeItem
  ).length;
  const inboxSize = gameState.inboxSize;

  return (
    <div className="h-full flex flex-col p-4">
      {/* Inbox Header */}
      <div className="mb-2">
        <div className="flex items-center justify-between border rounded px-4 py-2 bg-base-100">
          <span className="font-bold text-lg">
            Inbox{" "}
            <span className="text-base-content/50 font-normal">
              {activeCount} / {inboxSize}
            </span>
          </span>
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                className={`btn btn-xs btn-ghost ${
                  filter === f.value ? "bg-base-200 font-bold" : ""
                }`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Outlook-style Inbox List */}
      <div className="flex-1 overflow-y-auto">
        {inboxItems.length === 0 && (
          <div className="text-center text-base-content/60 py-8">
            No messages found.
          </div>
        )}
        <ul>
          {inboxItems.map((item) => {
            const isNew = gameState.dayNumber === item.receivedDay;
            const isExpanded = expandedId === item.id;
            const isTicket = item.messageType === "ticket";
            const isSpam = item.messageType === "spam";
            const isComplaint = item.messageType === "complaint";
            // For tickets, show type/difficulty badge only in expanded view
            let typeBadge = null;
            if (isTicket) {
              typeBadge = getTypeBadge(item.ticketType, item.difficulty, true);
            }
            return (
              <React.Fragment key={item.id}>
                <li
                  className={
                    `group px-4 py-3 cursor-pointer ` +
                    `${isNew ? "bg-base-300 font-semibold" : "bg-base-100"} ` +
                    `hover:bg-base-200 transition border-b border-base-200 last:border-b-0`
                  }
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold truncate mr-2">
                        {item.sender}
                      </span>
                      <span className="text-xs text-base-content/60"></span>
                      <span className="text-xs text-base-content/60">
                        {`Day ${item.receivedDay} ${formatGameTime(
                          item.receivedTime
                        )}`}
                      </span>
                      <span className="truncate text-base-content/80">
                        {item.subject}
                      </span>
                    </div>
                    <div className="text-xs text-base-content/60 truncate">
                      {item.body.length > 60
                        ? item.body.slice(0, 60) + "..."
                        : item.body}
                    </div>
                  </div>
                  {/* Chevron for expand/collapse */}
                  <span className="ml-2">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </span>
                </li>
                {/* Expanded message details */}
                {isExpanded && (
                  <div className="px-12 py-4 bg-base-200 border-b border-base-300">
                    <div className="mb-2">
                      <div className="font-bold text-base mb-1">
                        {item.subject}
                      </div>
                      <div className="text-sm text-base-content/60 mb-2">
                        From:{" "}
                        <span className="font-semibold">{item.sender}</span>
                      </div>
                      {typeBadge && <div className="mb-2">{typeBadge}</div>}
                      <div className="text-sm whitespace-pre-line mb-2">
                        {item.body}
                      </div>
                    </div>
                    {isTicket && (
                      <div className="flex gap-4 text-xs mb-2">
                        {/* Type/difficulty badge already shown above */}
                      </div>
                    )}
                    {/* Assign to Agent Section */}
                    {isTicket && (
                      <div className="mt-4">
                        <div className="font-semibold text-xs mb-2">
                          Assign to Agent
                        </div>
                        <div className="flex flex-col gap-2">
                          {agents
                            .sort(
                              (a, b) =>
                                b.skills[item.ticketType] -
                                a.skills[item.ticketType]
                            )
                            .filter((agent) => {
                              // Hide agents who are already working or at max capacity
                              return !agent.assignedTicketId;
                            })
                            .map((agent) => {
                              const agentSkill = agent.skills[item.ticketType];
                              const isGood = agentSkill >= item.difficulty;
                              const hasEnergy = gameState.energyRemaining > 0;

                              return (
                                <div
                                  key={agent.id}
                                  className={`flex items-center gap-4 p-2 rounded ${
                                    isGood ? "bg-success/10" : "bg-base-100"
                                  }`}
                                >
                                  <div className="avatar">
                                    <div className="w-8 rounded-full bg-base-300">
                                      <img
                                        src={agent.profileImage}
                                        alt={agent.agentName}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-semibold">
                                      {agent.agentName}
                                    </div>
                                    <div className="text-xs text-base-content/60">
                                      {item.ticketType.charAt(0).toUpperCase() +
                                        item.ticketType.slice(1)}{" "}
                                      skill:{" "}
                                      <span
                                        className={`font-bold text-lg ${
                                          isGood
                                            ? "text-success"
                                            : "text-base-content"
                                        }`}
                                      >
                                        {agentSkill}
                                      </span>
                                      {"  |  "}Ticket difficulty:{" "}
                                      <span className="font-bold text-lg">
                                        {item.difficulty}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    className={`btn btn-xs ${
                                      !hasEnergy
                                        ? "btn-outline btn-error"
                                        : isGood
                                        ? "btn-success"
                                        : "btn-outline"
                                    }`}
                                    disabled={!hasEnergy}
                                    onClick={() =>
                                      assignTicketToAgent(item.id, agent.id)
                                    }
                                  >
                                    {!hasEnergy ? "No Energy" : "Assign"}
                                  </button>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                    {/* Quick Actions for spam/complaint */}
                    {!isTicket && (
                      <div className="mt-4">
                        <button
                          className="btn btn-xs btn-outline btn-error"
                          onClick={() => deleteSpam(item.id)}
                        >
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
