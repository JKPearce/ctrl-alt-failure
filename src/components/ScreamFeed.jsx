import { formatGameTime } from "@/lib/helpers/gameHelpers";

const ScreamFeed = ({ screams, agents }) => {
  return (
    <div className="p-4 flex flex-col gap-3">
      {screams.length === 0 && (
        <div className="text-center text-base-content/60">No screams yet. Peaceful... for now.</div>
      )}
      {screams.map((scream) => {
        const agent = agents[scream.agentId];
        return (
          <div key={scream.screamId} className="card bg-base-100 border">
            <div className="card-body p-3 flex items-start gap-3">
              <div className="avatar">
                <div className="w-8 rounded-full">
                  <img src={agent.profileImage} alt={agent.agentName} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-base-content/60">
                  <span className="font-semibold text-base-content">{agent.agentName}</span>
                  <span>Day {scream.dayCreated}</span>
                  <span>{formatGameTime(scream.createdAt)}</span>
                </div>
                <div className="text-sm">{scream.message}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScreamFeed;
