import { useGame } from "@/context/useGame";

export default function Summary() {
  const { gameState, startNewDay } = useGame();
  const today = gameState.dailySummaries[0]; // latest

  if (!today) return null; // defensive

  return (
    <div className="flex flex-col items-center p-6 gap-6">
      <h2 className="text-2xl font-bold">Day {today.day} Summary</h2>

      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Resolved</div>
          <div className="stat-value text-success">{today.resolved}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Failed</div>
          <div className="stat-value text-error">{today.failed}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Complaints</div>
          <div className="stat-value">{today.complaints}</div>
        </div>
      </div>

      {today.mvp && (
        <p className="italic">
          MVP today: <strong>{today.mvp}</strong>
        </p>
      )}

      <button className="btn btn-primary mt-4" onClick={() => startNewDay()}>
        Start Day {today.day + 1}
      </button>
    </div>
  );
}
