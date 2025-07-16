import { useTicket } from "../../lib/hooks/useTicket";

const OpenTicketsList = () => {
  const { ticketList } = useTicket();
  const openTickets = ticketList.filter(
    (ticket) => ticket.state === "Open" || ticket.state === "Work in Progress"
  );

  return (
    <div className="md:col-span-3 max-h-96 overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <table className="table table-pin-rows">
        <thead>
          <tr>
            <th>Ticket Number</th>
            <th>Category</th>
            <th>State</th>
            <th>Issue Description</th>
            <th>Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {openTickets.length === 0 ? (
            <tr colSpan={5}>
              <td>No open tickets</td>
            </tr>
          ) : (
            openTickets.map((ticket) => (
              <tr key={ticket.ticketNumber}>
                <td>{ticket.ticketNumber}</td>
                <td>{ticket.category}</td>
                <td>{ticket.state}</td>
                <td>{ticket.issueDescription}</td>
                <td>{ticket.assignedTo}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export { OpenTicketsList };
