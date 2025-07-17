import { format } from "date-fns";

function ActivityLog({ log }) {
  return (
    <section
      id="activity-log"
      className="bg-base-100 shadow-md border border-base-300 p-3 min-h-40 overflow-y-auto w-full"
    >
      <h2 className="font-bold text-accent mb-2">Activity Feed</h2>
      <ul className="space-y-2">
        {log.length === 0 && (
          <li className="text-sm text-base-content/50">No recent activity</li>
        )}
        {log.map((entry, i) => (
          <li
            key={i}
            className={`rounded-md px-3 py-2 text-sm border-l-4 ${
              entry.type === "agent_comment"
                ? "bg-base-200 border-warning"
                : "bg-base-300 border-info"
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-base-content">{entry.actor}</span>
              <span className="text-xs text-base-content/50">
                {format(entry.timestamp, "HH:mm:ss")}
              </span>
            </div>
            <p className="text-sm leading-snug text-base-content">
              {entry.message}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ActivityLog;
