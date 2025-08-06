import { GameContext } from "@/context/GameContext";
import {
  GAME_ACTIONS,
  INBOX_ACTIONS,
  LOG_TYPES,
} from "@/lib/config/actionTypes";
import { checkAndSpawnComplaint } from "@/lib/helpers/inboxHelpers";
import { useContext, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const useActivityLog = () => {
  const { gameState, dispatch } = useContext(GameContext);
  const previousState = useRef({
    inbox: {},
    screams: [],
    agents: {},
  });

  useEffect(() => {
    // Watch for changes and log them
    const currentInbox = gameState.inbox;
    const currentScreams = gameState.screams;
    const currentAgents = gameState.agents;

    // New inbox items
    const newInboxItems = Object.keys(currentInbox).filter(
      (id) => !previousState.current.inbox[id]
    );

    newInboxItems.forEach((itemId) => {
      logEvent(LOG_TYPES.INBOX_ITEM_ADDED, `New ticket #${itemId} received`);

      //stop notifications for items created "overnight"
      if (gameState.gamePhase !== "active") return;
      if (gameState.gameTime.currentTick === 0) return;
      showToast("New inbox item!", "info");
    });

    // New screams

    if (currentScreams.length > previousState.current.screams.length) {
      const newScream = currentScreams[0];
      const agentName = currentAgents[newScream.agentId].agentName;

      logEvent(
        LOG_TYPES.SCREAM_CREATED,
        `${agentName}: "${newScream.message}"`
      );
      showToast(`${agentName} screamed!`, "scream");
    }

    // Resolved tickets
    const resolvedTickets = Object.values(currentInbox).filter(
      (ticket) =>
        ticket.resolved && !previousState.current.inbox[ticket.id]?.resolved
    );

    resolvedTickets.forEach(async (ticket) => {
      logEvent(LOG_TYPES.TICKET_RESOLVED, `Ticket #${ticket.id} resolved`);
      showToast("Ticket resolved!", "success");

      // Check for complaint spawning
      const complaint = await checkAndSpawnComplaint(
        ticket,
        currentAgents[ticket.resolvedBy],
        gameState.dayNumber,
        gameState.gameTime.currentTick,
        gameState.chaos
      );

      if (complaint) {
        // Add complaint to inbox
        dispatch({
          type: INBOX_ACTIONS.ADD_INBOX_ITEM,
          payload: { item: { [complaint.id]: complaint } },
        });

        logEvent(
          LOG_TYPES.COMPLAINT_CREATED,
          `Complaint filed for ticket #${ticket.id}`
        );
        showToast("Customer filed a complaint!", "complaint");
      }
    });

    // Update previous state
    previousState.current = {
      inbox: { ...currentInbox },
      screams: [...currentScreams],
      agents: { ...currentAgents },
    };
  }, [gameState]);

  const logEvent = (type, message) => {
    dispatch({
      type: GAME_ACTIONS.ADD_ACTIVITY_LOG,
      payload: {
        id: crypto.randomUUID(),
        type,
        message,
      },
    });
  };

  const showToast = (message, type) => {
    const toastStyles = {
      scream: {
        style: { background: "#ef4444", color: "white" },
        icon: "😱",
      },
      success: {
        style: { background: "#10b981", color: "white" },
        icon: "✅",
      },
      info: {
        style: { background: "#3b82f6", color: "white" },
        icon: "📧",
      },
      complaint: {
        style: { background: "#f59e0b", color: "white" },
        icon: "👎",
      },
    };

    toast(message, {
      duration: 4000,
      position: "top-right",
      ...toastStyles[type],
    });
  };

  return { logEvent, showToast };
};

export { useActivityLog };
