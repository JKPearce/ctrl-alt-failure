"use client";

import {
  AGENT_ACTIONS,
  GAME_ACTIONS,
  INBOX_ACTIONS,
} from "@/lib/config/actionTypes";
import {
  DEFAULT_BUSINESS_NAME,
  DEFAULT_ENERGY,
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
    energyRemaining: DEFAULT_ENERGY,
    inboxSize: DEFAULT_INBOX_SIZE,
    upgrades: DEFAULT_UPGRADES,
    dayNumber: 0,
    gamePhase: "setup", //options are"setup" | "active" | "running",
    agents: {},
    inbox: {},
    activityLog: [],
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

      case GAME_ACTIONS.START_GAME:
        return {
          ...state,
          dayNumber: 1,
          gamePhase: "active",
          agents: action.payload.agents,
          inbox: action.payload.inbox,
        };

      case GAME_ACTIONS.END_GAME:
        return {
          ...state,
          gamePhase: "game_over",
        };

      case GAME_ACTIONS.USE_ENERGY:
        return {
          ...state,
          energyRemaining: Number(
            state.energyRemaining - action.payload.actionCost
          ),
        };

      case GAME_ACTIONS.REPLENISH_ENERGY:
        return {
          ...state,
          energyRemaining: Number(action.payload.energy),
        };

      case GAME_ACTIONS.ADD_ACTIVITY_LOG:
        return {
          ...state,
          activityLog: [
            {
              ...action.payload,
            },
            ...state.activityLog,
          ], //reverse order so the newest log entry is the first item in the array
        };

      case AGENT_ACTIONS.SET_AGENT_COMMENT:
        return updateEntity(state, "agents", action.payload.agentID, {
          currentComment: action.payload.comment,
        });

      case AGENT_ACTIONS.SET_AGENT_ACTION:
        return updateEntity(state, "agents", action.payload.agentID, {
          currentAction: action.payload.action,
        });

      case INBOX_ACTIONS.ASSIGN_TICKET:
        return updateEntity(state, "inbox", action.payload.ticketID, {
          agentAssigned: Number(action.payload.agentID),
        });

      case INBOX_ACTIONS.UPDATE_TICKET_PROGRESS:
        return updateEntity(state, "inbox", action.payload.ticketID, {
          stepsRemaining: Number(action.payload.stepsRemaining),
        });

      case INBOX_ACTIONS.RESOLVE_TICKET:
        return updateEntity(state, "inbox", action.payload.ticketID, {
          stepsRemaining: 0,
          resolved: true,
          agentAssigned: null,
        });

      case INBOX_ACTIONS.ADD_INBOX_ITEM:
        return {
          ...state,
          inbox: {
            ...state.inbox,
            ...action.payload.items,
          },
        };

      default:
        console.warn("Unhandled action type:", action.type);
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
