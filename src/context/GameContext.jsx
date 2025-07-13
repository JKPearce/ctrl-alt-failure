"use client";

import { createContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTicket } from "../hooks/useTicket";

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const workInterval = useRef(null);
  const [currentAction, setCurrentAction] = useState("Idle");
  const [ticketInProgress, setTicketInProgress] = useState(null);
  const [money, setMoney] = useState(0);
  const [playerName, setPlayerName] = useState("Player");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { updateTicketDetails, findOpenTicket } = useTicket();
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    const savedLog = localStorage.getItem("activityLog");
    if (savedLog) {
      setActivityLog(JSON.parse(savedLog));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activityLog", JSON.stringify(activityLog));
  }, [activityLog]);

  useEffect(() => {
    if (!ticketInProgress) return;

    workInterval.current = setInterval(() => {
      setTimeRemaining((t) => {
        const nextNumber = t - 1;
        if (nextNumber <= 0) {
          clearInterval(workInterval.current);
          workInterval.current = null;

          setTimeout(() => {
            updateTicketDetails(ticketInProgress, "Resolve", playerName);
            logActivity(
              playerName,
              ` resolved Ticket #${ticketInProgress.ticketNumber}`,
              "You have resolved a ticket!"
            );

            setTicketInProgress(null);
            startWork();
          }, 0);

          return 0;
        }
        return nextNumber;
      });
    }, 1000); //1000 is 1 second

    return () => clearInterval(workInterval.current);
  }, [ticketInProgress]);

  const calculateTimeToResolve = (ticket) => {
    //here is where ill eventually add some algorithm that calculates a time to complete a ticket, this will use player stats, upgrades unlocked against the ticket "difficulty" which will be calculated by a players unlocks and stats, maybe someone spent more points into hardware knowledge or software knowledge and the ticket is a hardware issue so it would be "eaiser" to resolve therefore take less time
    const timeToResolve = 10; //going to just set this to 10 and make it be 10 seconds for now but this number will get calculated based on above comment
    return timeToResolve;
  };

  const startWork = () => {
    setTimeout(() => {
      const ticket = findOpenTicket();

      if (!ticket) {
        setCurrentAction("Idle");
        logActivity(
          playerName,
          "Finished working, no more tickets in the queue. Coffee time!",
          "The Ticket Queue is empty. Go take a break."
        );
        return;
      }

      if (currentAction !== "Working on Tickets") {
        setCurrentAction("Working on Tickets");
        logActivity(playerName, "Started working");
      }

      const timeToResolve = calculateTimeToResolve(ticket);
      setTicketInProgress(ticket);

      setTimeRemaining(timeToResolve);

      updateTicketDetails(
        ticket,
        "Work in Progress",
        playerName,
        timeToResolve
      );
    }, 50);
  };

  const stopWork = () => {
    setCurrentAction("Idle");
    updateTicketDetails(ticketInProgress, "Stop Work");
    setTicketInProgress(null);
    clearInterval(workInterval.current);
    logActivity(playerName, "Stopped working");
  };

  const logActivity = (actor, action, toastMessage = null) => {
    setActivityLog((prev) => [
      ...prev,
      {
        uID: crypto.randomUUID(),
        logItem: activityLog.length + 1,
        actor,
        action,
        time: Date.now(),
      },
    ]);
    if (toastMessage) {
      toast(toastMessage);
    }
  };

  return (
    <GameContext.Provider
      value={{
        currentAction,
        money,
        playerName,
        ticketInProgress,
        timeRemaining,
        activityLog,
        startWork,
        stopWork,
        logActivity,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameProvider };
