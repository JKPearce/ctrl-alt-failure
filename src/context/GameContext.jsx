"use client";

import { GAME_ACTIONS } from "@/helpers/actionTypes";
import {
  DEFAULT_ACTIONS,
  DEFAULT_BUSINESS_NAME,
  DEFAULT_INBOX_SIZE,
  DEFAULT_MONEY,
  DEFAULT_PLAYER_NAME,
  DEFAULT_UPGRADES,
} from "@/helpers/defaultGameState";
import { useTicket } from "@/hooks/useTicket";
import { createContext, useEffect, useReducer, useRef, useState } from "react";
import toast from "react-hot-toast";

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(reducer, {
    businessName: DEFAULT_BUSINESS_NAME,
    playerName: DEFAULT_PLAYER_NAME,
    money: DEFAULT_MONEY,
    actionsRemaining: DEFAULT_ACTIONS,
    inboxSize: DEFAULT_INBOX_SIZE,
    upgrades: DEFAULT_UPGRADES,
    dayNumber: 1,
    activityLog: [],
    // storyChoices: [],      //Will be used to inject to API LLM prompts
    //ticketsResolvedToday:[] //To show an end of day summary
    //stylesTheme: "dark" // change the css theme
    //language : "eng" //option to swap languages, or generate AI tickets in different languages
    //ticketTheme : "Retro Video Game" // user defined theme for the types of issues e.g retro video game theme could mean a ticket gets logged by Mario who is having issues piping with his command line
  });

  function reducer(state, action) {
    switch (action.type) {
      case GAME_ACTIONS.SET_PLAYER_NAME:
        return {
          ...state,
          playerName: action.payload,
        };
      case GAME_ACTIONS.SET_BUSINESS_NAME:
        return {
          ...state,
          businessName: action.payload,
        };
      default:
        return state;
    }
  }

  // useEffect(() => {
  //   const savedLog = localStorage.getItem("activityLog");
  //   if (savedLog) {
  //     setActivityLog(JSON.parse(savedLog));
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("activityLog", JSON.stringify(activityLog));
  // }, [activityLog]);

  // useEffect(() => {
  //   if (!ticketInProgress) return;

  //   workInterval.current = setInterval(() => {
  //     setTimeRemaining((t) => {
  //       const nextNumber = t - 1;
  //       if (nextNumber <= 0) {
  //         clearInterval(workInterval.current);
  //         workInterval.current = null;

  //         setTimeout(() => {
  //           updateTicketDetails(ticketInProgress, "Resolve", playerName);
  //           logActivity(
  //             playerName,
  //             ` resolved Ticket #${ticketInProgress.ticketNumber}`,
  //             "You have resolved a ticket!"
  //           );

  //           setTicketInProgress(null);
  //           startWork();
  //         }, 0);

  //         return 0;
  //       }
  //       return nextNumber;
  //     });
  //   }, 1000); //1000 is 1 second

  //   return () => clearInterval(workInterval.current);
  // }, [ticketInProgress]);

  // const calculateTimeToResolve = (ticket) => {
  //   //here is where ill eventually add some algorithm that calculates a time to complete a ticket, this will use player stats, upgrades unlocked against the ticket "difficulty" which will be calculated by a players unlocks and stats, maybe someone spent more points into hardware knowledge or software knowledge and the ticket is a hardware issue so it would be "eaiser" to resolve therefore take less time
  //   const timeToResolve = 10; //going to just set this to 10 and make it be 10 seconds for now but this number will get calculated based on above comment
  //   return timeToResolve;
  // };

  // const startWork = () => {
  //   setTimeout(() => {
  //     const ticket = findOpenTicket();

  //     if (!ticket) {
  //       setCurrentAction("Idle");
  //       logActivity(
  //         playerName,
  //         "Finished working, no more tickets in the queue. Coffee time!",
  //         "The Ticket Queue is empty. Go take a break."
  //       );
  //       return;
  //     }

  //     if (currentAction !== "Working on Tickets") {
  //       setCurrentAction("Working on Tickets");
  //       logActivity(playerName, "Started working");
  //     }

  //     const timeToResolve = calculateTimeToResolve(ticket);
  //     setTicketInProgress(ticket);

  //     setTimeRemaining(timeToResolve);

  //     updateTicketDetails(
  //       ticket,
  //       "Work in Progress",
  //       playerName,
  //       timeToResolve
  //     );
  //   }, 50);
  // };

  // const stopWork = () => {
  //   setCurrentAction("Idle");
  //   updateTicketDetails(ticketInProgress, "Stop Work");
  //   setTicketInProgress(null);
  //   clearInterval(workInterval.current);
  //   logActivity(playerName, "Stopped working");
  // };

  // const logActivity = (actor, action, toastMessage = null) => {
  //   setActivityLog((prev) => [
  //     ...prev,
  //     {
  //       uID: crypto.randomUUID(),
  //       logItem: activityLog.length + 1,
  //       actor,
  //       action,
  //       time: Date.now(),
  //     },
  //   ]);
  //   if (toastMessage) {
  //     toast(toastMessage);
  //   }
  // };

  return (
    <GameContext.Provider
      value={{
        gameState,
        dispatch,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameProvider };
