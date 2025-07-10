import { useState } from "react";
import { Ticket } from "./components/Ticket";
import "./index.css";

function App() {
  const [totalTicketCount, setTotalTicketCount] = useState(0);
  const [activeTickets, setActiveTickets] = useState([]);
  const [resolvedTickets, setResolvedTickets] = useState([]);

  const handleClick = () => {
    setTotalTicketCount(totalTicketCount + 1);

    const newTicket = {
      ticketNumber: totalTicketCount,
      raisedBy: "Billy",
      category: "Hardware",
      issueDescription: "Keyboard not working when i type",
    };

    setActiveTickets([...activeTickets, newTicket]);
  };

  const resolveTicket = (ticketObject) => {
    setActiveTickets((prev) =>
      prev.filter((ticket) => ticket.ticketNumber !== ticketObject.ticketNumber)
    );

    setResolvedTickets([...resolvedTickets, ticketObject]);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleClick}
        >
          Add Ticket
        </button>
        <h1>Active Ticket count: {activeTickets.length}</h1>
        <h1>Resolved Ticket count: {resolvedTickets.length}</h1>

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
              onResolve={() => resolveTicket(ticket)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
