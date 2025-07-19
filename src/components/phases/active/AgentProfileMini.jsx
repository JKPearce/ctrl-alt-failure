import { useGame } from "@/context/useGame";
import Image from "next/image";

function AgentProfileMini({ agent, onClick }) {
  const { gameState } = useGame();

  const currentTicket = Object.values(gameState.inbox).find(
    (msg) =>
      msg.messageType === "ticket" &&
      msg.agentAssigned === agent.id &&
      !msg.resolved
  );

  const moodColor =
    agent.moodScore <= -5
      ? "text-error"
      : agent.moodScore <= 2
      ? "text-warning"
      : "text-success";

  return (
    <div
      onClick={onClick}
      className="relative bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm hover:shadow-lg hover:scale-[1.03] transition-all duration-200 ease-out w-full flex flex-col gap-2 items-center text-center cursor-pointer"
    >
      {agent.currentComment && (
        <div className="absolute -top-5 right-0 text-xs px-3 py-2 shadow border border-base-300 max-w-[200px] z-50 animate-agent-pop bg-base-100 rounded-lg p-4">
          “{agent.currentComment}”
        </div>
      )}

      {/* Profile Avatar */}
      <div className="avatar">
        <div className="w-20 mask mask-squircle">
          <Image
            src={agent.profileImage}
            alt={`${agent.agentName} profile`}
            width={80}
            height={80}
            className="object-cover"
          />
        </div>
      </div>

      {/* Name and status */}
      <div>
        <h3 className="font-bold text-sm">{agent.nickName}</h3>
        <p className="text-xs text-base-content/60 italic">
          {agent.currentAction}
        </p>

        {agent.currentAction === "Working" && currentTicket && (
          <div className="w-full mt-1">
            <p className="text-xs text-base-content/60">
              Ticket #{currentTicket.id}
            </p>
            <progress
              className="progress progress-info w-full h-2"
              value={currentTicket.stepsRemaining}
              max="4"
            ></progress>
            <p className="text-[10px] text-base-content/40 text-center mt-1">
              {currentTicket.stepsRemaining} steps remaining
            </p>
          </div>
        )}
      </div>

      {/* Traits */}
      <div className="flex flex-wrap justify-center gap-1">
        {agent.personality.traits.slice(0, 2).map((trait, i) => (
          <span key={i} className="badge badge-warning badge-xs" title={trait}>
            {trait}
          </span>
        ))}
      </div>

      {/* Mood */}
      <div className="text-xs text-base-content/70">
        Mood:{" "}
        <span className={`font-bold ${moodColor}`}>{agent.moodScore}</span>
      </div>
    </div>
  );
}

export default AgentProfileMini;
