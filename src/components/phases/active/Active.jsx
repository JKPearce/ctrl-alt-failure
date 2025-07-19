"use client";

import { ControlPanel, Nav } from "@/components/phases/active/ControlPanel";
import { useGame } from "@/context/useGame";
import { useEffect } from "react";
import ActivityLog from "./ActivityLog";
import AgentGrid from "./AgentGrid";
import InboxPanel from "./InboxPanel";

function Active() {
  const { gameState, endGame } = useGame();

  useEffect(() => {
    console.log("Updated gameState:", gameState);

    if (gameState.gamePhase !== "active") return;
    if (Object.values(gameState.inbox).length >= gameState.inboxSize) {
      endGame();
    }
  }, [gameState]);

  return (
    <div className="h-screen w-full grid grid-rows-[auto_1fr] grid-cols-[250px_1fr] gap-2 p-2 bg-base-200 overflow-hidden">
      <div className="col-span-2">
        <ControlPanel />
      </div>

      {/* Left column — inbox (scrollable) */}
      <div className="h-full overflow-y-auto">
        <InboxPanel
          inbox={Object.values(gameState.inbox)}
          agents={Object.values(gameState.agents)}
        />
      </div>

      {/* Right column — log + agents */}
      <div className="flex flex-col gap-2 overflow-hidden">
        <div className="max-h-[33%] overflow-y-auto mb-2">
          <ActivityLog log={Object.values(gameState.activityLog)} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <AgentGrid agents={Object.values(gameState.agents)} />
        </div>
      </div>
    </div>
  );
}

export default Active;
