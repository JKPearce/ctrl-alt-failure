import { useEffect, useState } from "react";
import { Ticket } from "../components/Ticket";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [totalTicketCount, setTotalTicketCount] = useState();
  const [activeTickets, setActiveTickets] = useState();
  const [resolvedTickets, setResolvedTickets] = useState();

  const getSavedData = (key, fallback) => {
    const value = localStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };

  useEffect(() => {
    //initial load
    setActiveTickets(getSavedData("activeTickets", []));
    setResolvedTickets(getSavedData("resolvedTickets", []));
    setTotalTicketCount(getSavedData("totalTicketCount", 0));

    setLoading(false);
  }, []);

  useEffect(() => {
    //stops the initial loading overriding the local storage
    if (loading) return;

    localStorage.setItem("totalTicketCount", JSON.stringify(totalTicketCount));
    localStorage.setItem("activeTickets", JSON.stringify(activeTickets));
    localStorage.setItem("resolvedTickets", JSON.stringify(resolvedTickets));
  }, [activeTickets, resolvedTickets]);

  const handleAddTicket = () => {
    setTotalTicketCount(totalTicketCount + 1);

    const newTicket = {
      ticketNumber: totalTicketCount,
      raisedBy: "Billy",
      category: "Hardware",
      issueDescription: "Keyboard not working when i type",
    };

    setActiveTickets([...activeTickets, newTicket]);
  };

  const handleResolveTicket = (ticketObject) => {
    setActiveTickets((prev) =>
      prev.filter((ticket) => ticket.ticketNumber !== ticketObject.ticketNumber)
    );

    setResolvedTickets((prev) => [...prev, ticketObject]);
  };

  if (loading) return <h1>Loading...</h1>;
  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleAddTicket}
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
              onResolve={() => handleResolveTicket(ticket)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export { Dashboard };
