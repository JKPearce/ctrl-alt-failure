"use client";

import { useGame } from "@/context";
import AgentCard from "./AgentCard";
import InboxMessageCard from "./InboxMessageCard";

function Active() {
  const { gameState } = useGame();

  return (
    <>
      <h1>
        Hi {gameState.playerName} from company {gameState.businessName}
      </h1>
      <div className="grid grid-cols-2">
        <div>
          {gameState.agents.map((a) => {
            return <AgentCard key={a.id} agent={a} />;
          })}
        </div>
        <div>
          {gameState.inbox.map((m) => {
            return <InboxMessageCard key={m.id} message={m} />;
          })}
        </div>
      </div>
    </>
  );
}

export default Active;
