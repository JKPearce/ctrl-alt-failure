import { useGame } from "../context/useGame";

const CurrentTaskPanel = () => {
  const {
    currentAction,
    startWork,
    stopWork,
    ticketInProgress,
    timeRemaining,
  } = useGame();

  return (
    <>
      <div>
        <button onClick={currentAction === "Idle" ? startWork : stopWork}>
          {currentAction === "Idle" ? "Start Work" : "Stop Work"}
        </button>
        <div>
          <h1>Current Action: {currentAction}</h1>
          {currentAction === "Working on Tickets" && ticketInProgress ? (
            <div>
              <h2>Working on ticket: {ticketInProgress.ticketNumber}</h2>
              <p>Time to resolve: {timeRemaining}</p>
              <p>Ticket Issue: {ticketInProgress.issueDescription} </p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export { CurrentTaskPanel };
