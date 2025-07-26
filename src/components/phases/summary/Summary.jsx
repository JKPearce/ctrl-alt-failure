import { useGame } from "@/context/useGame";
import { AlertTriangle, CheckCircle, Star, XCircle } from "lucide-react";

export default function Summary() {
  const { gameState, startNewDay } = useGame();
  const today = gameState.dailySummaries[0]; // latest

  if (!today) return null;

  return (
    <div className="flex flex-col items-center p-6 gap-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">Day {today.day} Summary</h2>

      {/* DaisyUI stats component */}
      <div className="stats stats-vertical md:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-figure text-success">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="stat-title">Resolved</div>
          <div className="stat-value text-success">{today.resolved}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-error">
            <XCircle className="w-8 h-8" />
          </div>
          <div className="stat-title">Failed</div>
          <div className="stat-value text-error">{today.failed}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-warning">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="stat-title">Complaints</div>
          <div className="stat-value">{today.complaints}</div>
        </div>
      </div>

      {today.mvp && (
        <div className="card bg-base-200 shadow w-full max-w-md">
          <div className="card-body flex flex-row items-center gap-3">
            <Star className="w-6 h-6 text-warning" />
            <span className="font-semibold">MVP today:</span>
            <span className="font-bold">{today.mvp}</span>
          </div>
        </div>
      )}

      <button
        className="btn btn-primary btn-lg mt-6 w-full max-w-xs sticky bottom-4"
        onClick={() => startNewDay()}
      >
        Start Day {today.day + 1}
      </button>
    </div>
  );
}
