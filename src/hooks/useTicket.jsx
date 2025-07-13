"use client";

import { TicketContext } from "@/context/TicketContext";
import { useContext } from "react";

const useTicket = () => {
  const ctx = useContext(TicketContext);
  if (!ctx) {
    throw new Error("useTicket must be used within a TicketProvider");
  }
  return ctx;
};

export { useTicket };
