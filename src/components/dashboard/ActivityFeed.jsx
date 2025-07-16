// ActivityFeed.jsx
import { formatDistanceToNow } from "date-fns";
import { useGame } from "../../lib/hooks/useGame";

const ActivityFeed = () => {
  const { activityLog } = useGame();

  return (
    <section className="bg-base-200 rounded-lg shadow-lg p-4 space-y-4 h-full flex flex-col">
      <h2 className="text-xl font-semibold text-base-content">
        📜 Activity Feed
      </h2>
      <div className="overflow-y-auto h-[300px] space-y-2 pr-2 scroll-smooth">
        {[...activityLog].reverse().map((entry) => (
          <div
            key={entry.uID}
            className="bg-base-100 border border-base-300 p-3 rounded-lg"
          >
            <p className="text-sm text-base-content font-semibold">
              {entry.actor}
            </p>
            <p className="text-sm text-muted">{entry.action}</p>
            <p className="text-right text-xs text-muted">
              {formatDistanceToNow(entry.time, { addSuffix: true })}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export { ActivityFeed };
