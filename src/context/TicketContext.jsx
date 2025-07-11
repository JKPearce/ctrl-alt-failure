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
      state: "open",
      assignedTo: "",
      createdAt: Date.now(),
      resolvedAt: null,
    };

    setActiveTickets([...activeTickets, newTicket]);
  };

  const resolveTicket = (ticket, resolver) => {
    setActiveTickets((prev) =>
      prev.filter((t) => t.ticketNumber !== ticket.ticketNumber)
    );

    const updatedTicket = {
      ...ticket,
      state: "resolved",
      resolvedAt: Date.now(),
      resolvedBy: resolver,
    };

    setResolvedTickets((prev) => [...prev, updatedTicket]);
  };

  const updateTicketDetails = (ticketNumber, newData) => {
    const updatedTicketArray = activeTickets.map((i) => {
      if (i.ticketNumber === ticketNumber) {
        return {
          ...i,
          ...newData,
        };
      } else return i;
    });

    setActiveTickets(updatedTicketArray);
  };

  const findOpenTicket = () => {
    return activeTickets.find((t) => t.state === "open") || null;
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
        updateTicketDetails,
        findOpenTicket,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export { TicketContext, TicketProvider };
