import { formatDistanceToNow } from "date-fns";

function InboxMessages({ message }) {
  return (
    <div className="flex flex-col gap-1 text-sm">
      {/* Header row */}
      <div className="flex justify-between items-center w-full">
        <h3 className="font-semibold text-base-content truncate">
          {message.sender}
        </h3>
        <span className="text-xs text-base-content/50 whitespace-nowrap">
          {formatDistanceToNow(message.received, {
            includeSeconds: true,
            addSuffix: true,
          })}
        </span>
      </div>

      {/* Subject */}
      <p className="text-base-content/80 font-medium truncate">
        {message.subject || (
          <em className="text-base-content/40">(no subject)</em>
        )}
      </p>

      {/* Preview */}
      <p className="text-xs text-base-content/60 truncate">
        {message.body?.slice(0, 100) || "(no preview)"}
      </p>
    </div>
  );
}

export default InboxMessages;
