import { createContext, useState } from "react";
import { useTicket } from "./useTicket";

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const [currentTask, setCurrentTask] = useState("Idle");
  const [ticketInProgress, setTicketInProgress] = useState();
  const [money, setMoney] = useState(0);
  const [playerName, setPlayerName] = useState("Player");
  const { activeTickets, updateTicketDetails, findOpenTicket } = useTicket();

  const calculateTimeToResolve = (ticket) => {
    //here is where ill eventually add some algorithm that calculates a time to complete a ticket, this will use player stats, upgrades unlocked against the ticket "difficulty" which will be calculated by a players unlocks and stats, maybe someone spent more points into hardware knowledge or software knowledge and the ticket is a hardware issue so it would be "eaiser" to resolve therefore take less time
    const timeToResolve = 10; //going to just set this to 10 and make it be 10 seconds for now but this number will get calculated based on above comment
    return timeToResolve;
  };

  const startWork = () => {
    const ticket = findOpenTicket();
    if (!ticket) return; //add something to notify user that theres nothing "go grab some coffee, theres no work for you here"

    setTicketInProgress(ticket);
    setCurrentTask("Working on Tickets");

    const newTicketData = {
      state: "Work in Progress",
      assignedTo: playerName,
      timeToResolve: calculateTimeToResolve(ticket),
    };

    updateTicketDetails(ticket.ticketNumber, newTicketData);
  };

  const stopWork = () => {
    setCurrentTask("Idle");
    const newTicketData = {
      state: "open",
      assignedTo: "",
      timeToResolve: null,
    };

    updateTicketDetails(ticketInProgress.ticketNumber, newTicketData);
    setTicketInProgress({});
  };

  return (
    <GameContext.Provider
      value={{
        currentTask,
        money,
        playerName,
        ticketInProgress,
        startWork,
        stopWork,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameProvider };
