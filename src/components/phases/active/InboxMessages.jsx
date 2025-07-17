import { formatDistanceToNow } from "date-fns";

function InboxMessages({ message }) {
  return (
    <>
      <div className="list-col-grow">
        <h2 className="font-bold">From: {message.sender}</h2>
        <p className="text-xs font-semibold">Subject: {message.subject}</p>
        <p className="text-xs">
          {formatDistanceToNow(message.received, {
            includeSeconds: true,
            addSuffix: true,
          })}
        </p>
      </div>
      <div className="list-col-wrap">
        <p className="font-light text-xs opacity-50">
          {message.body.slice(0, 100)}...
        </p>
      </div>
    </>
  );
}

export default InboxMessages;
