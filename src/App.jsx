import { useState } from "react";
import { Ticket } from "./components/Ticket";
import "./index.css";

function App() {
  const [ticketCount, setTicketCount] = useState(0);
  const [tickets, setTickets] = useState([]);

  const handleClick = () => {
    setTicketCount(ticketCount + 1);
    const newTicket = {
      id: ticketCount,
      raisedBy: "Billy",
      category: "Hardware",
      issueDescription: "Keyboard not working when i type",
    };
    setTickets([...tickets, newTicket]);
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
        <div
          id="ticket-section"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4"
        >
          {tickets.map((ticket) => (
            <Ticket
              key={ticket.id}
              raisedBy={ticket.raisedBy}
              category={ticket.category}
              issueDescription={ticket.issueDescription}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
