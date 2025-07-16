"use client";

import { AGENT_ACTIONS, GAME_ACTIONS } from "@/lib/config/actionTypes";
import {
  DEFAULT_ACTION_POINTS,
  DEFAULT_BUSINESS_NAME,
  DEFAULT_INBOX_SIZE,
  DEFAULT_MONEY,
  DEFAULT_PLAYER_NAME,
  DEFAULT_UPGRADES,
} from "@/lib/config/defaultGameState";
import { createContext, useReducer } from "react";

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(reducer, {
    businessName: DEFAULT_BUSINESS_NAME,
    playerName: DEFAULT_PLAYER_NAME,
    money: DEFAULT_MONEY,
    actionsPointsRemaining: DEFAULT_ACTION_POINTS,
    inboxSize: DEFAULT_INBOX_SIZE,
    upgrades: DEFAULT_UPGRADES,
    dayNumber: 0,
    gamePhase: "setup", //options are"setup" | "active" | "running",
    agents: {},
    inbox: {},
    activityLog: [],
    // storyChoices: [],      //Will be used to inject to API LLM prompts
    //ticketsResolvedToday:[] //To show an end of day summary
    //stylesTheme: "dark" // change the css theme
    //language : "eng" //option to swap languages, or generate AI tickets in different languages
    //ticketTheme : "Retro Video Game" // user defined theme for the types of issues e.g retro video game theme could mean a ticket gets logged by Mario who is having issues piping with his command line
  });

  //this is the brains of the whole game
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

      case GAME_ACTIONS.START_NEW_DAY:
        return {
          ...state,
          dayNumber: state.dayNumber + 1,
          gamePhase: "active",
        };

      case GAME_ACTIONS.START_GAME:
        return {
          ...state,
          dayNumber: 1,
          gamePhase: "active",
          agents: action.payload.agents,
          inbox: action.payload.inbox,
        };

      case GAME_ACTIONS.USE_ACTION_POINT:
        return {
          ...state,
          actionsPointsRemaining:
            state.actionsPointsRemaining - action.payload.actionCost,
        };

      case AGENT_ACTIONS.ASSIGN_TICKET:
        return updateEntity(state, "agents", action.payload.agentID, {
          assignedTicket: action.payload.ticketID,
          currentAction: "working",
        });

      case AGENT_ACTIONS.SET_AGENT_COMMENT:
        return updateEntity(state, "agents", action.payload.agentID, {
          currentComment: action.payload.comment,
        });

      default:
        return state;
    }
  }

  function updateEntity(state, entityKey, entityID, updates) {
    return {
      ...state,
      [entityKey]: {
        ...state[entityKey],
        [entityID]: {
          ...state[entityKey][entityID],
          ...updates,
        },
      },
    };
  }

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
