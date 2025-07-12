import { createContext, useEffect, useState } from "react";

const TicketContext = createContext();

const TicketProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [ticketList, setTicketList] = useState([]);

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
    setTicketList(getSavedData("ticketList", []));
    setLoading(false);
  }, []);

  useEffect(() => {
    //stops the initial loading overriding the local storage
    if (loading) return;

    localStorage.setItem("ticketList", JSON.stringify(ticketList));
  }, [ticketList]);

  const addTicket = () => {
    const newTicket = {
      ticketNumber: ticketList.length + 1,
      raisedBy: "Billy",
      category: "Hardware",
      issueDescription: "Keyboard not working when i type",
      state: "Open",
      assignedTo: "",
      createdAt: Date.now(),
      resolvedAt: null,
    };

    setTicketList([...ticketList, newTicket]);
  };

  const updateTicketDetails = (
    ticketToUpdate,
    action,
    actorName,
    timeToResolve
  ) => {
    let dataToUpdate = {};

    switch (action) {
      case "Resolve":
        dataToUpdate = {
          state: "Resolved",
          resolvedAt: Date.now(),
          resolvedBy: actorName,
        };
        break;
      case "Work in Progress":
        dataToUpdate = {
          state: "Work in Progress",
          assignedTo: actorName,
          timeToResolve: timeToResolve,
        };
        break;
      case "Stop Work":
        dataToUpdate = {
          state: "Open",
          assignedTo: "",
        };
    }

    setTicketList((prev) => {
      const updatedList = prev.map((t) =>
        t.ticketNumber === ticketToUpdate.ticketNumber
          ? { ...t, ...dataToUpdate }
          : t
      );
      return updatedList;
    });
  };

  const findOpenTicket = () => {
    return ticketList.find((t) => t.state === "Open") || null;
  };

  return (
    <TicketContext.Provider
      value={{
        loading,
        ticketList,
        addTicket,
        updateTicketDetails,
        findOpenTicket,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export { TicketContext, TicketProvider };
