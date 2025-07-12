import { createContext, useEffect, useRef, useState } from "react";
import { useTicket } from "./useTicket";

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const workInterval = useRef(null);
  const [currentAction, setCurrentTask] = useState("Idle");
  const [ticketInProgress, setTicketInProgress] = useState(null);
  const [money, setMoney] = useState(0);
  const [playerName, setPlayerName] = useState("Player");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { updateTicketDetails, findOpenTicket } = useTicket();

  useEffect(() => {
    if (!ticketInProgress) return;
    workInterval.current = setInterval(() => {
      setTimeRemaining((t) => {
        const next = t - 1;
        if (next <= 0) {
          clearInterval(workInterval.current);
          workInterval.current = null;

          setTimeout(() => {
            updateTicketDetails(ticketInProgress, "Resolve", playerName);
            setTicketInProgress(null);

            setTimeout(() => {
              startWork(); // give React time to propagate TicketContext updates
            }, 10);
          }, 0);

          return 0;
        }
        return next;
      });
    }, 1000); //1000 is 1 second

    return () => clearInterval(workInterval.current);
  }, [ticketInProgress]);

  const calculateTimeToResolve = (ticket) => {
    //here is where ill eventually add some algorithm that calculates a time to complete a ticket, this will use player stats, upgrades unlocked against the ticket "difficulty" which will be calculated by a players unlocks and stats, maybe someone spent more points into hardware knowledge or software knowledge and the ticket is a hardware issue so it would be "eaiser" to resolve therefore take less time
    const timeToResolve = 2; //going to just set this to 10 and make it be 10 seconds for now but this number will get calculated based on above comment
    return timeToResolve;
  };

  const startWork = () => {
    setTimeout(() => {
      const ticket = findOpenTicket();
      console.log("🎯 startWork ticket:", ticket);

      if (!ticket) {
        setCurrentTask("Idle");
        return;
      }

      setCurrentTask("Working on Tickets");
      setTicketInProgress(ticket);

      const timeToResolve = calculateTimeToResolve(ticket);

      setTimeRemaining(timeToResolve);
      updateTicketDetails(ticket, "Work in Progress", playerName);
    }, 50);
  };

  const stopWork = () => {
    setCurrentTask("Idle");
    updateTicketDetails(ticketInProgress, "Stop Work");
    setTicketInProgress(null);
    clearInterval(workInterval.current);
  };

  return (
    <GameContext.Provider
      value={{
        currentAction,
        money,
        playerName,
        ticketInProgress,
        timeRemaining,
        startWork,
        stopWork,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameProvider };
