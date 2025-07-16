function InboxMessageCard({ message }) {
  console.log(message);
  return (
    <div className="card bg-base-100 shadow-md border border-base-300 w-full max-w-xl">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg">{message.subject}</h2>
            <p className="text-sm text-neutral-content">
              From: {message.sender}
            </p>
          </div>
          <p className="text-xs text-right text-neutral-content whitespace-nowrap">
            {message.received}
          </p>
        </div>
        <p className="mt-2 whitespace-pre-line text-sm">{message.body}</p>
      </div>
    </div>
  );
}

export default InboxMessageCard;
