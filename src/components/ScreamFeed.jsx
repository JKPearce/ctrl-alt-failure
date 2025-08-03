import { formatGameTime } from "@/lib/helpers/gameHelpers";

const ScreamFeed = ({ screams, agents }) => {
  console.log(screams);
  console.log(agents);
  return (
    <>
      {screams.map((scream) => (
        <div key={scream.screamId} className="scream">
          <span className="agent-name">{agents[scream.agentID].agentName}</span>
          <span className="scream-body">{scream.message}</span>
          <span className="scream-time">
            {formatGameTime(scream.createdAt)} - Day {scream.dayCreated}
          </span>
        </div>
      ))}
    </>
  );
};

export default ScreamFeed;
