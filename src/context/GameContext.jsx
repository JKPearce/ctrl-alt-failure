"use client";

import {
  AGENT_ACTIONS,
  GAME_ACTIONS,
  INBOX_ACTIONS,
} from "@/lib/config/actionTypes";
import { DEFAULT_GAME_STATE } from "@/lib/config/defaultGameState";
import { getContract } from "@/lib/helpers/contractHelpers";
import { summariseDay } from "@/lib/helpers/summariseDay";
import { createContext, useReducer } from "react";

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(reducer, DEFAULT_GAME_STATE);

  //this is the brains of the whole game
  function reducer(state, action) {
    switch (action.type) {
      case GAME_ACTIONS.START_GAME:
        const { contractId } = action.payload;
        const contractDef = getContract(contractId);

        return {
          ...state,
          loading: false,
          gamePhase: "active",
          businessName: action.payload.businessName,
          agents: action.payload.selectedAgents,
          inbox: action.payload.inbox,
          founder: action.payload.selectedFounder,
          chaos: Math.max(5, contractDef.baseChaos), // enforce floor
          openComplaints: 0,
          currentContract: {
            id: contractId,
            ticketsRequired: contractDef.ticketsRequired,
            ticketsResolved: Number(0),
          },
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

      case GAME_ACTIONS.START_NEW_DAY:
        return {
          ...state,
          inbox: {
            ...state.inbox,
            ...action.payload.newItems,
          },
          gamePhase: "active",
          dayNumber: Number(state.dayNumber + 1),
        };

      case GAME_ACTIONS.SET_LOADING:
        return {
          ...state,
          loading: action.payload.loading,
        };

      case GAME_ACTIONS.END_DAY:
        // If the contract is already complete, do **not** override the phase
        if (state.gamePhase === "contract_complete") return state;

        const summary = summariseDay(state, state.dayNumber);

        return {
          ...state,
          gamePhase: "summary",
          dailySummaries: [summary, ...state.dailySummaries],
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

      case AGENT_ACTIONS.SET_AGENT_COMMENT:
        return updateEntity(state, "agents", action.payload.agentID, {
          currentComment: action.payload.comment,
        });

      case AGENT_ACTIONS.SET_AGENT_ACTION:
        return updateEntity(state, "agents", action.payload.agentID, {
          currentAction: action.payload.action,
        });

      case INBOX_ACTIONS.ASSIGN_TICKET: {
        // Assign the agent to the ticket and mark it inactive
        const updatedInboxState = updateEntity(
          state,
          "inbox",
          action.payload.ticketID,
          {
            agentAssigned: action.payload.agentID,
            activeItem: false,
          }
        );

        // Increment the agent's assigned ticket count
        const agentId = action.payload.agentID;
        const updatedAgents = updateEntity(
          updatedInboxState,
          "agents",
          agentId,
          {
            currentAssignedTickets:
              updatedInboxState.agents[agentId].currentAssignedTickets + 1,
          }
        );

        return updatedAgents;
      }

      case INBOX_ACTIONS.TICKET_FAIL:
        const updatedState = updateEntity(
          state,
          "inbox",
          action.payload.ticketID,
          {
            failCount: state.inbox[action.payload.ticketID].failCount + 1,
          }
        );
        return { ...updatedState, openComplaints: state.openComplaints + 1 };

      case INBOX_ACTIONS.RESOLVE_TICKET: {
        const agentId = action.payload.resolvedBy;

        const updatedInboxState = updateEntity(
          state,
          "inbox",
          action.payload.ticketID,
          {
            resolved: true,
            agentAssigned: null,
            successChance: action.payload.successChance,
            resolvedBy: agentId,
            resolvedOnDay: state.dayNumber,
            resolutionNotes: action.payload.resolutionNotes,
            activeItem: false,
          }
        );

        // check for game win (contract goal reached)
        const newTotal = state.currentContract.ticketsResolved + 1;
        const won = newTotal >= state.currentContract.ticketsRequired;

        // update agent's currentAssignedTickets
        const updatedState = updateEntity(
          updatedInboxState,
          "agents",
          agentId,
          {
            currentAssignedTickets:
              updatedInboxState.agents[agentId].currentAssignedTickets - 1,
          }
        );

        return {
          ...updatedState,
          currentContract: {
            ...state.currentContract,
            ticketsResolved: newTotal,
          },
          gamePhase: won ? "contract_complete" : state.gamePhase,
        };
      }

      case INBOX_ACTIONS.ADD_INBOX_ITEM:
        return {
          ...state,
          inbox: {
            ...state.inbox,
            ...action.payload.items,
          },
        };

      case INBOX_ACTIONS.DELETE_SPAM:
        return updateEntity(state, "inbox", action.payload.ticketID, {
          activeItem: false,
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
