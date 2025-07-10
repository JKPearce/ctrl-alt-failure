const Ticket = ({
  raisedBy = "Bob",
  category = "Hardware",
  issueDescription = "Computer is borken please fix ty",
}) => {
  return (
    <div key={"ticket-component"} className="flex flex-col gap-4">
      <div
        id="ticket-body"
        className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto mt-10"
      >
        <div id="ticket-header" className="">
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
      </div>
    </div>
  );
};

export { Ticket };
