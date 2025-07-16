import { useGame } from "../../lib/hooks/useGame";

const CurrentTaskPanel = () => {
  const {
    currentAction,
    startWork,
    stopWork,
    ticketInProgress,
    timeRemaining,
  } = useGame();

  const isWorking = currentAction === "Working on Tickets";

  return (
    <section className="bg-base-200 rounded-lg shadow-lg p-6 space-y-4 h-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-base-content flex items-center gap-2">
          🛠️ Current Task
        </h2>
        <button
          className={`btn ${isWorking ? "btn-error" : "btn-primary"}`}
          onClick={isWorking ? stopWork : startWork}
        >
          {isWorking ? "Stop Work" : "Start Work"}
        </button>
      </div>

      <p className="text-base-content">
        Status: <span className="font-semibold">{currentAction}</span>
      </p>

      {isWorking && ticketInProgress && (
        <div className="space-y-2 border-t border-base-300 pt-4 transition-opacity duration-300 animate-fade-in">
          <p className="text-base-content">
            Ticket{" "}
            <span className="font-bold">#{ticketInProgress.ticketNumber}</span>
          </p>
          <p className="text-sm text-muted">
            {ticketInProgress.issueDescription}
          </p>
          <progress
            className="progress progress-primary w-full ring-1 ring-primary"
            value={ticketInProgress.timeToResolve - timeRemaining}
            max={ticketInProgress.timeToResolve}
          />
          <p className="text-right text-xs text-muted">
            {timeRemaining}s remaining
          </p>
        </div>
      )}
    </section>
  );
};

export { CurrentTaskPanel };
