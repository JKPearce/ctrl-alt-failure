"use client";

import AgentGrid from "@/components/phases/active/AgentGrid";
import { ControlPanel } from "@/components/phases/active/ControlPanel";
import InboxPanel from "@/components/phases/active/InboxPanel";
import { useGame } from "@/context/useGame";
import { useEffect } from "react";

function Active() {
  const { gameState, endGame } = useGame();

  useEffect(() => {
    console.log("state currently: ", gameState);

    if (gameState.gamePhase !== "active") return;
    if (Object.values(gameState.inbox).length >= gameState.inboxSize) {
      endGame();
    }
  }, [gameState]);

  return (
    <div className="h-screen w-full bg-base-100 p-4 space-y-4">
      {/* Top nav */}
      <ControlPanel />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100%-5rem)]">
        {/* Inbox Section (expanded 3/5) */}
        <div className="lg:col-span-3 flex flex-col">
          <div className="card bg-base-200 shadow-xl h-full">
            <div className="card-body space-y-4">
              <h2 className="card-title">📥 Inbox</h2>
              <InboxPanel
                inbox={Object.values(gameState.inbox)}
                agents={Object.values(gameState.agents)}
              />
            </div>
          </div>
        </div>

        {/* Agent + controls (2/5) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="card bg-base-200 shadow-xl flex-1">
            <div className="card-body space-y-2">
              <h2 className="card-title">🧑‍💻 Your Agents</h2>
              <AgentGrid agents={Object.values(gameState.agents)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Active;
