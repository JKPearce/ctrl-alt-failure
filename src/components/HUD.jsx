import React from "react";
import { GAME_TIME, formatGameTime } from "@/lib/helpers/gameHelpers";

export default function HUD({ gameState }) {
  const inboxItems = Object.values(gameState.inbox);
  const activeCount = inboxItems.filter((i) => i.activeItem).length;
  const inboxSize = gameState.inboxSize;

  const ticketsRequired = gameState.currentContract?.ticketsRequired || 0;
  const ticketsResolved = inboxItems.filter(
    (i) => i.messageType === "ticket" && i.resolved
  ).length;

  const chaos = gameState.chaos ?? 0;

  const dayProgressRaw = Math.max(
    0,
    Math.min(
      1,
      (gameState.gameTime.currentTick - GAME_TIME.DAY_START) /
        (GAME_TIME.DAY_END - GAME_TIME.DAY_START)
    )
  );
  const dayProgress = Math.round(dayProgressRaw * 100);

  const inboxPercent = Math.min(100, Math.round((activeCount / inboxSize) * 100));
  const contractPercent = ticketsRequired
    ? Math.min(100, Math.round((ticketsResolved / ticketsRequired) * 100))
    : 0;

  return (
    <div className="w-full bg-base-100 border-b">
      <div className="max-w-5xl mx-auto w-full px-4 py-2">
        <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
          {/* Inbox Pressure */}
          <div className="stat">
            <div className="stat-title">Inbox</div>
            <div className="stat-value text-info">
              {activeCount} / {inboxSize}
            </div>
            <div className="stat-desc">
              <progress
                className={`progress ${inboxPercent > 80 ? "progress-error" : inboxPercent > 60 ? "progress-warning" : "progress-info"}`}
                value={inboxPercent}
                max={100}
              />
            </div>
          </div>

          {/* Contract Progress */}
          <div className="stat">
            <div className="stat-title">Contract</div>
            <div className="stat-value">
              {ticketsResolved} / {ticketsRequired || "?"}
            </div>
            <div className="stat-desc">
              <progress
                className="progress progress-primary"
                value={contractPercent}
                max={100}
              />
            </div>
          </div>

          {/* Chaos */}
          <div className="stat">
            <div className="stat-title">Chaos</div>
            <div className="stat-value text-warning">{chaos}</div>
            <div className="stat-desc">
              <progress
                className={`progress ${chaos >= 70 ? "progress-error" : chaos >= 40 ? "progress-warning" : "progress-success"}`}
                value={chaos}
                max={100}
              />
            </div>
          </div>

          {/* Time/Day */}
          <div className="stat">
            <div className="stat-title">Day {gameState.dayNumber}</div>
            <div className="stat-value text-base-content">
              {formatGameTime(gameState.gameTime.currentTick)}
            </div>
            <div className="stat-desc">
              <progress
                className="progress progress-secondary"
                value={dayProgress}
                max={100}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}