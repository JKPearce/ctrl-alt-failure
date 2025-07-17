import { useGame } from "@/lib/hooks/useGame";
import { useState } from "react";
import InboxMessages from "./InboxMessages";
import MessageModal from "./MessageModal";

function InboxPanel({ inbox }) {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { assignTicketToAgent } = useGame();

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setModalOpen(true);
  };

  const assignAndClose = (agentID, messageID) => {
    setModalOpen(false);
    assignTicketToAgent(messageID, agentID);
  };

  return (
    <section id="inbox-panel" className="h-full w-full overflow-y-auto pr-1">
      {modalOpen && selectedMessage && (
        <MessageModal
          message={selectedMessage}
          assignAndClose={assignAndClose}
          onClose={() => setModalOpen(false)}
        />
      )}
      <ul className="list gap-2 bg-base-100 shadow-md border border-base-300 w-full max-w-xl space-y-2">
        <li className="list-row sticky top-0 z-10 bg-base-100 p-4 pb-2 tracking-wide font-bold text-accent">
          Incoming Messages
        </li>
        {inbox.map((m) => (
          <li
            key={m.id}
            className="list-row px-4 py-3 border-b border-base-300 hover:bg-base-300/40 transition rounded cursor-pointer"
            onClick={() => handleMessageClick(m)}
          >
            <InboxMessages key={m.id} message={m} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default InboxPanel;
