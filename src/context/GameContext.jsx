"use client";

import {
  AGENT_ACTIONS,
  GAME_ACTIONS,
  INBOX_ACTIONS,
} from "@/lib/config/actionTypes";
import { DEFAULT_GAME_STATE } from "@/lib/config/defaultGameState";
import { createContext, useReducer } from "react";

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(reducer, DEFAULT_GAME_STATE);

  //this is the brains of the whole game
  function reducer(state, action) {
    switch (action.type) {
      case GAME_ACTIONS.START_GAME:
        return {
          ...state,
          gamePhase: "active",
          businessName: action.payload.businessName,
          agents: action.payload.selectedAgents,
          inbox: action.payload.inbox,
          founder: action.payload.selectedFounder,
          currentContract: action.payload.selectedContract,
        };

      case GAME_ACTIONS.END_GAME:
        return {
          ...state,
          gamePhase: "game_over",
        };

      case GAME_ACTIONS.RESTART_GAME:
        return DEFAULT_GAME_STATE;

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

      case GAME_ACTIONS.END_DAY:
        return {
          ...state,
          gamePhase: "summary",
          dayNumber: state.dayNumber + 1,
          endDaySummary: action.payload.endDaySummary,
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
          agentAssigned: action.payload.agentID,
        });

      case INBOX_ACTIONS.UPDATE_TICKET_PROGRESS:
        return updateEntity(state, "inbox", action.payload.ticketID, {
          stepsRemaining: action.payload.stepsRemaining,
        });

      case INBOX_ACTIONS.RESOLVE_TICKET:
        return updateEntity(state, "inbox", action.payload.ticketID, {
          stepsRemaining: 0,
          resolved: true,
          agentAssigned: null,
          successChance: action.payload.successChance,
          resolvedBy: action.payload.resolvedBy,
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
