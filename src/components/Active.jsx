import { useAgent } from "@/hooks/useAgent";
import { useInbox } from "@/hooks/useInbox";
import { formatGameTime } from "@/lib/helpers/gameHelpers";
import {
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Handshake,
  Inbox,
  Megaphone,
} from "lucide-react";
import React, { useState } from "react";
import ContractView from "./ContractView";
import InboxScreen from "./InboxScreen";

const navItems = [
  { label: "inbox", icon: Inbox },
  { label: "contract", icon: Handshake },
  { label: "stats", icon: BarChart2 },
  { label: "ctrl-alt-scream", icon: Megaphone },
];

function getStatusColor(action) {
  switch (action) {
    case "Working":
      return "bg-success";
    case "idle":
      return "bg-gray-400";
    case "On Break":
      return "bg-warning";
    case "Offline":
      return "bg-error";
    default:
      return "bg-gray-400";
  }
}

const Active = ({ gameState, pauseTime, resumeTime, setTimeSpeed }) => {
  const { assignTicketToAgent, deleteSpam } = useInbox();
  const { getAgentByID, setAgentAction } = useAgent();
  const [selectedNav, setSelectedNav] = useState("inbox");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedAgentId, setSelectedAgentId] = useState(null);

  // Convert agents object to array
  const agents = Object.values(gameState.agents);
  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <div className="navbar bg-base-100 border-b">
        <div className="flex-1">
          <span className="btn btn-ghost text-xl">CTRL-ALT-FAIL</span>
        </div>
        <div className="flex-1 justify-center flex">
          <span className="text-lg font-semibold">
            {gameState.businessName}
          </span>
        </div>
        <div className="flex-1 justify-end flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <button
              className={`btn ${
                gameState.gameTime.isPaused ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => {
                if (gameState.gameTime.isPaused) {
                  resumeTime();
                } else {
                  pauseTime();
                }
              }}
            >
              {gameState.gameTime.isPaused ? "▶️" : "⏸️"}
            </button>

            {[1, 2, 3].map((speed) => (
              <button
                key={speed}
                className={`btn ${
                  gameState.gameTime.speed === speed
                    ? "btn-active"
                    : "btn-outline"
                }`}
                onClick={() => setTimeSpeed(speed)}
              >
                {speed}x
              </button>
            ))}
            <span>
              <Clock />
              Time:{formatGameTime(gameState.gameTime.currentTick)}
            </span>
          </div>
          <span>Day {gameState.dayNumber}</span>
          <span>Chaos {gameState.chaos}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`transition-all duration-200 bg-base-200 border-r flex flex-col p-4 gap-6 ${
            sidebarOpen ? "w-64" : "w-20"
          }`}
        >
          {/* Sidebar Toggle Button */}
          <button
            className="btn btn-ghost btn-sm mb-2 self-end"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
          {/* Navigation Section */}
          <div>
            {sidebarOpen && (
              <div className="text-xs font-bold uppercase text-base-content/50 mb-2 pl-1">
                Navigation
              </div>
            )}
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className={`btn btn-ghost ${
                      sidebarOpen ? "justify-start" : "justify-center"
                    } gap-2 ${
                      selectedNav === item.label && !selectedAgentId
                        ? "bg-base-300"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedNav(item.label);
                      setSelectedAgentId(null);
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    {sidebarOpen && item.label}
                  </button>
                );
              })}
            </nav>
          </div>
          {/* Agent Section */}
          <div>
            {sidebarOpen && (
              <div className="text-xs font-bold uppercase text-base-content/50 mb-2 pl-1">
                Agents
              </div>
            )}
            <div
              className={`flex flex-col gap-4 ${
                !sidebarOpen ? "items-center" : ""
              }`}
            >
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  className={`flex items-center gap-2 w-full rounded-lg transition-colors ${
                    selectedAgentId === agent.id
                      ? "bg-base-300"
                      : "hover:bg-base-100"
                  } ${!sidebarOpen ? "justify-center p-0" : "p-2"}`}
                  onClick={() => setSelectedAgentId(agent.id)}
                  tabIndex={0}
                  aria-label={agent.agentName}
                >
                  <div className="avatar relative">
                    <div className="w-10 rounded-full bg-base-300">
                      <img src={agent.profileImage} alt={agent.agentName} />
                    </div>
                    {/* Status Dot */}
                    <span
                      className={`status absolute bottom-0 right-0 border-2 border-base-200 rounded-full w-3 h-3 ${getStatusColor(
                        agent.currentAction
                      )}`}
                      title={agent.currentAction}
                    />
                  </div>
                  {sidebarOpen && (
                    <div className="text-xs text-left">
                      <div className="font-semibold">{agent.agentName}</div>
                      <div className="text-xs text-base-content/60">
                        {agent.currentAction}
                      </div>
                      {agent.assignedTicketId && (
                        <progress
                          className="progress progress-primary"
                          value={
                            gameState.inbox[agent.assignedTicketId]
                              .resolveProgress
                          }
                          max={
                            gameState.inbox[agent.assignedTicketId]
                              .timeToResolve
                          }
                        />
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>
        {/* Dynamic Main Area */}
        <main className="flex-1">
          <div className="w-full max-w-2xl mx-auto h-full flex flex-col">
            {selectedAgent ? (
              <div className="p-6 rounded-lg bg-base-100 shadow border flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-16 rounded-full bg-base-300">
                      <img
                        src={selectedAgent.profileImage}
                        alt={selectedAgent.agentName}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold">
                      {selectedAgent.agentName}
                    </div>
                    <div className="text-base-content/60 text-sm">
                      {selectedAgent.nickName} &bull; Age {selectedAgent.age}{" "}
                      &bull; {selectedAgent.gender}
                    </div>
                    <div className="text-sm mt-1 italic">
                      {selectedAgent.personalStatement}
                    </div>
                  </div>
                </div>
                <div className="flex gap-8 mt-2">
                  <div>
                    <div className="font-semibold text-xs mb-1">Skills</div>
                    <div className="text-xs">
                      Hardware: {selectedAgent.skills.hardware}
                    </div>
                    <div className="text-xs">
                      Software: {selectedAgent.skills.software}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-xs mb-1">
                      Personality
                    </div>
                    <div className="text-xs">
                      Traits: {selectedAgent.personality.traits.join(", ")}
                    </div>
                    <div className="text-xs">
                      Fav Food: {selectedAgent.personality.favFood}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="font-semibold text-xs mb-1">Chat Log</div>
                  <div className="bg-base-200 rounded p-3 text-xs h-40 overflow-y-auto flex flex-col gap-2">
                    {/* Placeholder for chat log, replace with real data later */}
                    <div className="chat chat-start">
                      <div className="chat-bubble">
                        You assigned {selectedAgent.agentName} to Ticket:
                        "Broken printer"
                      </div>
                    </div>
                    <div className="chat chat-end">
                      <div className="chat-bubble">
                        Printers are just made to make my life harder...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                {selectedNav === "inbox" && (
                  <InboxScreen
                    gameState={gameState}
                    assignTicketToAgent={assignTicketToAgent}
                    deleteSpam={deleteSpam}
                  />
                )}
                {selectedNav === "stats" && (
                  <div className="text-center text-lg text-base-content/70 flex-1 flex items-start">
                    Stats view coming soon...
                  </div>
                )}
                {selectedNav === "ctrl-alt-scream" && (
                  <div className="text-center text-lg text-base-content/70 flex-1 flex items-start">
                    Ctrl-Alt-Scream view coming soon...
                  </div>
                )}
                {selectedNav === "contract" && (
                  <div className="text-center text-lg text-base-content/70 flex-1 flex items-start">
                    <ContractView contract={gameState.currentContract} />
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Active;
