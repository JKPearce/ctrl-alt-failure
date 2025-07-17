"use client";

import { Nav } from "@/components/Nav";
import { useGame } from "@/lib/hooks/useGame";
import { useEffect } from "react";
import ActivityLog from "./ActivityLog";
import AgentGrid from "./AgentGrid";
import InboxPanel from "./InboxPanel";

function Active() {
  const { gameState } = useGame();

  useEffect(() => {
    console.log("Updated gameState:", gameState);
  }, [gameState]);

  return (
    <>
      <div className="h-screen w-full grid grid-rows-[auto_1fr] grid-cols-[250px_1fr] gap-2 p-2 bg-base-200">
        <div className="col-span-2">
          <Nav />
        </div>

        <div className="row-span-1">
          <InboxPanel
            inbox={Object.values(gameState.inbox)}
            agents={Object.values(gameState.agents)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <ActivityLog log={gameState.activityLog} />
          <AgentGrid agents={gameState.agents} />
        </div>
      </div>
    </>
  );
}

export default Active;
