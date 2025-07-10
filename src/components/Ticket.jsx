const Ticket = ({
  raisedBy,
  category,
  issueDescription,
  ticketNumber,
  onResolve,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div id="ticket-body" className="bg-white shadow-md rounded-lg p-6">
        <div id="ticket-header" className="">
          <h2>Ticket Number: {ticketNumber}</h2>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Category: {category}
          </h2>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Raised by: {raisedBy}
          </h2>
        </div>
        <p className="text-gray-700 text-sm mb-1">
          Issue Description: {issueDescription}
        </p>
        <button
          className="mt-4 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-150 ease-in-out text-sm"
          onClick={onResolve}
        >
          Resolve
        </button>
      </div>
    </div>
  );
};

export { Ticket };
