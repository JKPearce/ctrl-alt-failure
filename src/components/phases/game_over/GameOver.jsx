"use client";

import { useGame } from "@/context/useGame";

const GameOver = () => {
  const { gameState, restartGame } = useGame();
  const {
    playerName,
    businessName,
    money,
    inbox,
    inboxSize,
    agents,
    dayNumber,
  } = gameState;

  const ticketCount = Object.keys(inbox).length;
  const agentCount = Object.keys(agents).length;

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-base-100 text-base-content p-6">
      <h1 className="text-4xl font-bold mb-4">📬 Inbox Overflow!</h1>
      <p className="text-lg mb-2">
        {businessName} collapsed under the weight of unresolved tickets.
      </p>
      <p className="mb-4 text-sm opacity-70">
        Operated by {playerName} • Lasted {dayNumber} turns
      </p>

      <div className="bg-base-200 p-4 rounded-md shadow-md mb-6 w-full max-w-md text-left space-y-2">
        <div>
          <strong>💰 Money Remaining:</strong> ${money}
        </div>
        <div>
          <strong>📥 Inbox:</strong> {ticketCount} / {inboxSize} (overflowed)
        </div>
        <div>
          <strong>👨‍💻 Agents:</strong> {agentCount}
        </div>
      </div>

      <button className="btn btn-primary" onClick={() => restartGame()}>
        🔁 Restart Game
      </button>
    </div>
  );
};

export default GameOver;
