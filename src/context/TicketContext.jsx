import { createContext, useEffect, useState } from "react";

const TicketContext = createContext();

const TicketProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [totalTicketCount, setTotalTicketCount] = useState();
  const [activeTickets, setActiveTickets] = useState();
  const [resolvedTickets, setResolvedTickets] = useState();

  //helper function to get and parse localstorage data
  const getSavedData = (key, fallback) => {
    const value = localStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };

  //runs on first load
  useEffect(() => {
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

  const addTicket = () => {
    setTotalTicketCount(totalTicketCount + 1);

    const newTicket = {
      ticketNumber: totalTicketCount,
      raisedBy: "Billy",
      category: "Hardware",
      issueDescription: "Keyboard not working when i type",
    };

    setActiveTickets([...activeTickets, newTicket]);
  };

  const resolveTicket = (resolvedTicket) => {
    setActiveTickets((prev) =>
      prev.filter(
        (ticket) => ticket.ticketNumber !== resolvedTicket.ticketNumber
      )
    );

    setResolvedTickets((prev) => [...prev, resolvedTicket]);
  };

  return (
    <TicketContext.Provider
      value={{
        loading,
        activeTickets,
        resolvedTickets,
        totalTicketCount,
        addTicket,
        resolveTicket,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export { TicketContext, TicketProvider };
