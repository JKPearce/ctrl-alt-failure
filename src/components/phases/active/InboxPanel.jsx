// InboxPanel.jsx — Refactored for theme, layout, modal toggle

import { useGame } from "@/context/useGame";
import { useState } from "react";
import InboxMessages from "./InboxMessages";
import MessageModal from "./MessageModal";

function InboxPanel({ inbox }) {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { assignTicketToAgent, gameState } = useGame();

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setModalOpen(true);
  };

  const assignAndClose = (agentID, messageID) => {
    setModalOpen(false);
    assignTicketToAgent(messageID, agentID);
  };

  return (
    <section id="inbox-panel" className="h-full w-full overflow-y-auto">
      {modalOpen && selectedMessage && (
        <MessageModal
          message={selectedMessage}
          assignAndClose={assignAndClose}
          onClose={() => setModalOpen(false)}
        />
      )}

      <div className="bg-base-100 border border-base-300 shadow-md rounded-xl overflow-hidden">
        <div className="sticky top-0 z-10 bg-base-100 px-4 py-3 border-b border-base-300">
          <h2 className="font-bold text-accent tracking-wide">
            Inbox — {inbox.length} / {gameState.inboxSize}
          </h2>
        </div>

        <ul className="divide-y divide-base-300">
          {inbox.map((message) => (
            <li
              key={message.id}
              className="px-4 py-3 hover:bg-base-300/30 transition cursor-pointer"
              onClick={() => handleMessageClick(message)}
            >
              <InboxMessages message={message} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default InboxPanel;
