import { CurrentTaskPanel } from "../components/CurrentTaskPanel";
import { Ticket } from "../components/Ticket";
import { useGame } from "../context/useGame";
import { useTicket } from "../context/useTicket";

const Dashboard = () => {
  const { loading, addTicket, resolveTicket, ticketList } = useTicket();
  const { playerName } = useGame();

  if (loading) return <h1>Loading...</h1>;
  return (
    <>
      <div className="min-h-screen p-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={addTicket}
        >
          Add Ticket
        </button>
        <h1>
          Open Ticket count:{" "}
          {ticketList.filter((t) => t.state === "Open").length}
        </h1>
        <h1>
          Work in Progress Tickets count:{" "}
          {ticketList.filter((t) => t.state === "Work in Progress").length}
        </h1>
        <h1>
          Resolved Ticket count:{" "}
          {ticketList.filter((t) => t.state === "Resolved").length}
        </h1>

        <CurrentTaskPanel />

        <div
          id="ticket-section"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4"
        >
          {ticketList.map((ticket) =>
            ticket.state === "Open" ? (
              <Ticket
                key={ticket.ticketNumber}
                ticketNumber={ticket.ticketNumber}
                raisedBy={ticket.raisedBy}
                category={ticket.category}
                issueDescription={ticket.issueDescription}
                onResolve={() => resolveTicket(ticket, playerName)}
              />
            ) : null
          )}
        </div>
      </div>
    </>
  );
};

export { Dashboard };
