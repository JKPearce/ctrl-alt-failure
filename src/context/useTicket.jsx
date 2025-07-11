import { useContext } from "react";
import { TicketContext } from "./TicketContext";

const useTicket = () => {
  const ctx = useContext(TicketContext);
  if (!ctx) {
    throw new Error("useTicket must be used within a TicketProvider");
  }
  return ctx;
};

export { useTicket };
