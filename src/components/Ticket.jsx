const Ticket = ({ raisedBy, category, issueDescription, ticketNumber }) => {
  return (
    <div className="flex flex-col gap-4">
      <div id="ticket-body" className="bg-white shadow-md rounded-lg p-6">
        <div id="ticket-header" className="">
          <h2 className="text-gray-800">Ticket Number: {ticketNumber}</h2>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Category: {category}
          </h2>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Raised by: {raisedBy}
          </h2>
        </div>
        <p className=" text-gray-800 text-sm mb-1">
          Issue Description: {issueDescription}
        </p>
      </div>
    </div>
  );
};

export { Ticket };
