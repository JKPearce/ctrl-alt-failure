import { CurrentTaskPanel } from "../components/CurrentTaskPanel";
import { Ticket } from "../components/Ticket";
import { useGame } from "../context/useGame";
import { useTicket } from "../context/useTicket";

const Dashboard = () => {
  const { loading, activeTickets, resolvedTickets, addTicket, resolveTicket } =
    useTicket();
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
        <h1>Active Ticket count: {activeTickets.length}</h1>
        <h1>Resolved Ticket count: {resolvedTickets.length}</h1>
        <CurrentTaskPanel />

        <div
          id="ticket-section"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4"
        >
          {activeTickets.map((ticket) => (
            <Ticket
              key={ticket.ticketNumber}
              ticketNumber={ticket.ticketNumber}
              raisedBy={ticket.raisedBy}
              category={ticket.category}
              issueDescription={ticket.issueDescription}
              onResolve={() => resolveTicket(ticket, playerName)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export { Dashboard };
