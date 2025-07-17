const { formatDistanceToNow } = require("date-fns");

function InboxMessages({ message }) {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div className="flex justify-between w-full">
        <h2 className="font-semibold text-sm truncate">{message.sender}</h2>
        <span className="text-xs text-base-content/50 pl-2 shrink-0 whitespace-nowrap">
          {formatDistanceToNow(message.received, {
            includeSeconds: true,
            addSuffix: true,
          })}
        </span>
      </div>

      <p className="text-sm text-base-content/70 truncate">{message.subject}</p>
      <p className="text-xs text-base-content/40 truncate">
        {message.body.slice(0, 80)}...
      </p>
    </div>
  );
}

export default InboxMessages;
