import { useGame } from "@/context/useGame";
import React from "react";

/**
 * DaySummary Component
 *
 * Props:
 * - dayNumber: number
 * - contract: { name: string, flavor: string }
 * - summaryLog: string[]
 * - dailySatisfactionDelta: number
 * - satisfaction: number
 * - activityLog: { eventType: string, actor: string, message: string, timestamp: number }[]
 * - onStartNextDay: () => void
 */
export default function Summary() {
  const { gameState } = useGame();
  const {
    dayNumber,
    currentContract,

    dailySatisfactionDelta,
    satisfaction,
    activityLog,
  } = gameState;

  function onStartNextDay() {
    //call game function
  }

  return (
    <div className="flex justify-center p-6 bg-base-200 min-h-screen">
      <div className="card w-full max-w-3xl bg-base-100 shadow-xl">
        <div className="card-body space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="card-title text-2xl">Day {dayNumber} Summary</h2>
            <button className="btn btn-outline btn-sm" onClick={onStartNextDay}>
              Start Next Day
            </button>
          </div>

          <div>
            <p className="text-lg font-medium">Contract:</p>
            <p className="text-xl">{currentContract.name}</p>
            <p className="text-sm italic opacity-70">
              {currentContract.flavor}
            </p>
          </div>

          {/* <div>
            <h3 className="text-lg font-semibold">Ticket Results</h3>
            <ul className="list-disc list-inside space-y-1">
              {summaryLog.map((line, idx) => (
                <li key={idx} className="text-base">
                  {line}
                </li>
              ))}
            </ul>
          </div> */}

          {/* <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Daily Satisfaction:</p>
              <p
                className={
                  dailySatisfactionDelta >= 0 ? "text-success" : "text-error"
                }
              >
                {dailySatisfactionDelta >= 0 ? "+" : ""}
                {dailySatisfactionDelta.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="font-medium">Total Satisfaction:</p>
              <p>{satisfaction.toFixed(2)}</p>
            </div>
          </div> */}

          <div
            tabIndex={0}
            className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
          >
            <div className="collapse-title text-md font-medium">
              Activity Log ({activityLog.length})
            </div>
            <div className="collapse-content">
              <ul className="list-disc list-inside space-y-1">
                {activityLog.map((entry, idx) => (
                  <li key={idx} className="text-sm">
                    <span className="font-semibold">[{entry.eventType}]</span>{" "}
                    {entry.actor}: {entry.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
