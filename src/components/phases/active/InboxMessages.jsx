const { formatDistanceToNow } = require("date-fns");

function InboxMessages({ message }) {
  return (
    <div className="flex justify-between items-start w-full gap-2">
      {/* Left: sender + subject + preview */}
      <div className="flex flex-col overflow-hidden">
        <h2 className="font-semibold text-sm truncate">{message.sender}</h2>
        <p className="text-xs text-base-content/70 truncate">
          {message.subject}
        </p>
        <p className="text-xs text-base-content/40 truncate">
          {message.body.slice(0, 80)}...
        </p>
      </div>

      {/* Right: timestamp */}
      <div className="text-xs text-right text-base-content/50 whitespace-nowrap pl-2">
        {formatDistanceToNow(message.received, {
          includeSeconds: true,
          addSuffix: true,
        })}
      </div>
    </div>
  );
}

export default InboxMessages;
