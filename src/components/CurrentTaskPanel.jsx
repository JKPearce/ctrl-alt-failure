import { useGame } from "../context/useGame";

const CurrentTaskPanel = () => {
  const { currentTask, startWork, stopWork, ticketInProgress } = useGame();

  return (
    <>
      <div>
        <button onClick={currentTask === "Idle" ? startWork : stopWork}>
          {currentTask === "Idle" ? "Start Work" : "Stop Work"}
        </button>
        <div>
          <h1>Current Task: {currentTask}</h1>
          {currentTask === "Working on Tickets" ? (
            <div>
              <h2>Working on ticket: {ticketInProgress.ticketNumber}</h2>
              <p>Ticket Issue: {ticketInProgress.issueDescription} </p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export { CurrentTaskPanel };
