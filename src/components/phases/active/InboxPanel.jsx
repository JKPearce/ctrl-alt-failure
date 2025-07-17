import { useState } from "react";
import InboxMessages from "./InboxMessages";
import MessageModal from "./MessageModal";

function InboxPanel({ inbox, agents }) {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleMessageClick = (message) => {
    console.log(message);
    setSelectedMessage(message);
    setModalOpen(true);
  };

  const assignAndClose = (agentID) => {
    setModalOpen(false);
    console.log(agentID);
  };

  return (
    <section id="inbox-panel">
      {modalOpen && (
        <MessageModal
          message={selectedMessage}
          modalOpen={modalOpen}
          assignAndClose={assignAndClose}
          onClose={() => setModalOpen(false)}
        />
      )}
      <ul className="list bg-base-100 shadow-md border border-base-300 w-full max-w-xl">
        <li class="p-4 pb-2  tracking-wide font-bold text-accent">
          Incoming Messages
        </li>
        {inbox.map((m) => (
          <li
            key={m.id}
            className="list-row"
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
