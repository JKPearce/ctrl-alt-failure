import { useGame } from "@/context/useGame";
import { AlertTriangle, CheckCircle, Star, XCircle } from "lucide-react";

export default function Summary() {
  const { gameState, startNewDay } = useGame();
  const today = gameState.dailySummaries[0]; // latest

  if (!today) return null; // defensive

  return (
    <div className="flex flex-col items-center p-6 gap-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">Day {today.day} Summary</h2>

      <div className="w-full flex flex-col md:flex-row gap-4">
        <div className="flex-1 card bg-base-100 shadow-md p-4 flex flex-col items-center">
          <CheckCircle className="w-8 h-8 text-success mb-1" />
          <div className="text-sm text-base-content/60">Resolved</div>
          <div className="text-2xl font-bold text-success">
            {today.resolved}
          </div>
        </div>
        <div className="flex-1 card bg-base-100 shadow-md p-4 flex flex-col items-center">
          <XCircle className="w-8 h-8 text-error mb-1" />
          <div className="text-sm text-base-content/60">Failed</div>
          <div className="text-2xl font-bold text-error">{today.failed}</div>
        </div>
        <div className="flex-1 card bg-base-100 shadow-md p-4 flex flex-col items-center">
          <AlertTriangle className="w-8 h-8 text-warning mb-1" />
          <div className="text-sm text-base-content/60">Complaints</div>
          <div className="text-2xl font-bold">{today.complaints}</div>
        </div>
      </div>

      {today.mvp && (
        <div className="flex items-center gap-2 bg-base-200 rounded-lg px-4 py-2 mt-2 shadow">
          <Star className="w-5 h-5 text-warning" />
          <span className="font-semibold">MVP today:</span>
          <span className="font-bold">{today.mvp}</span>
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
