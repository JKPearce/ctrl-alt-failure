"use client";

import {
  AGENT_ACTIONS,
  GAME_ACTIONS,
  INBOX_ACTIONS,
} from "@/lib/config/actionTypes";
import { DEFAULT_GAME_STATE } from "@/lib/config/defaultGameState";
import { clearResolvedTicketAssignments } from "@/lib/helpers/agentHelpers";
import { getContract } from "@/lib/helpers/contractHelpers";
import { summariseDay } from "@/lib/helpers/gameHelpers";
import { progressAndResolveTickets } from "@/lib/helpers/inboxHelpers";
import { createContext, useReducer } from "react";

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(reducer, DEFAULT_GAME_STATE);

  function reducer(state, action) {
    switch (action.type) {
      case GAME_ACTIONS.START_GAME:
        const { contractId } = action.payload;
        const contract = getContract(contractId);

        return {
          ...state,
          gamePhase: "active",
          businessName: action.payload.businessName,
          agents: action.payload.selectedAgents,
          inbox: action.payload.inbox,
          founder: action.payload.selectedFounder,
          chaos: contract.baseChaos,
          openComplaints: 0,
          currentContract: contract,
        };

      case GAME_ACTIONS.RESTART_GAME:
        return DEFAULT_GAME_STATE;

      case GAME_ACTIONS.ADD_ACTIVITY_LOG:
        return {
          ...state,
          activityLog: [
            {
              ...action.payload,
              day: Number(state.dayNumber),
              time: Number(action.payload.time),
            },
            ...state.activityLog,
          ], //reverse order so the newest log entry is the first item in the array
        };

      case GAME_ACTIONS.START_NEW_DAY:
        return {
          ...state,
          inbox: {
            ...state.inbox,
            ...action.payload.newItems,
          },
          gamePhase: "active",
          dayNumber: Number(state.dayNumber + 1),
          gameTime: {
            ...state.gameTime,
            currentTick: 0,
          },
        };

      case GAME_ACTIONS.SET_LOADING:
        return {
          ...state,
          loading: action.payload.loading,
        };

      case GAME_ACTIONS.GAME_TICK:
        const nextTick = state.gameTime.currentTick + 1;

        const activeCount = Object.values(state.inbox).filter(
          (t) => t.activeItem
        ).length;
        const newPhase =
          activeCount >= state.inboxSize
            ? "game_over"
            : nextTick >= 480
            ? "summary"
            : state.gamePhase;

        //check for game over conditions
        if (newPhase === "game_over") {
          return {
            ...state,
            gamePhase: "game_over",
          };
        } else if (newPhase === "summary") {
          const summary = summariseDay(state, state.dayNumber);

          return {
            ...state,
            gamePhase: "summary",
            dailySummaries: [summary, ...state.dailySummaries],
          };
        }

        //progress and resolve tickets
        const newInbox = progressAndResolveTickets(
          state.inbox,
          nextTick,
          state.dayNumber,
          state.agents
        );
        //clear resolved ticket assignments remove the ticket ID from the agent object
        const newAgents = clearResolvedTicketAssignments(
          state.agents,
          newInbox
        );

        return {
          ...state,
          gameTime: { ...state.gameTime, currentTick: nextTick },
          inbox: newInbox,
          agents: newAgents,
        };

      case GAME_ACTIONS.PAUSE_TIME:
        return {
          ...state,
          gameTime: { ...state.gameTime, isPaused: true },
        };

      case GAME_ACTIONS.RESUME_TIME:
        return {
          ...state,
          gameTime: { ...state.gameTime, isPaused: false },
        };

      case GAME_ACTIONS.SET_TIME_SPEED:
        return {
          ...state,
          gameTime: { ...state.gameTime, speed: action.payload.speed },
        };

      case GAME_ACTIONS.CONTRACT_COMPLETE: {
        const contract = getContract(state.currentContract.id);
        const penalty = state.openComplaints > contract.complaintLimit ? 10 : 0;
        return { ...state, baseChaos: contract.baseChaos + penalty };
      }

      case GAME_ACTIONS.START_NEW_CONTRACT:
        return {
          ...state,
          currentContract: action.payload.contract,
          chaos: action.payload.contract.baseChaos,
        };

      case INBOX_ACTIONS.ASSIGN_TICKET: {
        //update the inbox state to mark the ticket as inactive
        const updatedInboxState = updateEntity(
          state,
          "inbox",
          action.payload.ticketID,
          {
            agentAssigned: action.payload.agentID,
            activeItem: false,
          }
        );

        //update the agents state to assign the ticket to the agent
        const updatedAgents = updateEntity(
          updatedInboxState,
          "agents",
          action.payload.agentID,
          {
            assignedTicketId: action.payload.ticketID,
            currentAction: "WORKING",
          }
        );

        //return the updated state
        return updatedAgents;
      }

      case INBOX_ACTIONS.ADD_INBOX_ITEM:
        return {
          ...state,
          inbox: {
            ...state.inbox,
            ...action.payload.item,
          },
        };

      case INBOX_ACTIONS.DELETE_SPAM:
        return updateEntity(state, "inbox", action.payload.ticketID, {
          activeItem: false,
        });

      case AGENT_ACTIONS.SET_AGENT_ACTION:
        return updateEntity(state, "agents", action.payload.agentID, {
          currentAction: action.payload.action,
        });

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
