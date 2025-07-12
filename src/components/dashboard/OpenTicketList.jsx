import { useTicket } from "../../context/useTicket";

const OpenTicketList = () => {
  const { ticketList } = useTicket();

  return (
    <div
      id="ticket-section"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4"
    >
      {ticketList.map((ticket) =>
        ticket.state === "Open" ? (
          <Ticket
            key={ticket.ticketNumber}
            ticketNumber={ticket.ticketNumber}
            raisedBy={ticket.raisedBy}
            category={ticket.category}
            issueDescription={ticket.issueDescription}
          />
        ) : null
      )}
    </div>
  );
};

export { OpenTicketList };
