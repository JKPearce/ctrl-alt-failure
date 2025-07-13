import { useTicket } from "../../context/useTicket";

const OpenTicketsList = () => {
  const { ticketList } = useTicket();
  const openTickets = ticketList.filter(
    (ticket) => ticket.state === "Open" || ticket.state === "Work in Progress"
  );

  return (
    <div className="md:col-span-3 max-h-1/2 overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <table className="table table-pin-cols">
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
            <tr className="">
              <td>No open tickets</td>
            </tr>
          ) : (
            openTickets.map((ticket) => (
              <tr key={ticket.ticketNumber}>
                <th>{ticket.ticketNumber}</th>
                <th>{ticket.category}</th>
                <th>{ticket.state}</th>
                <th>{ticket.issueDescription}</th>
                <th>{ticket.assignedTo}</th>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export { OpenTicketsList };
