"use client";
import {
  ActivityFeed,
  CurrentTaskPanel,
  DeskOverview,
  OpenTicketsList,
} from "@/components/dashboard";

import { useTicket } from "@/hooks/useTicket";

const Dashboard = () => {
  const { loading, addTicket, generateTicketFromAI } = useTicket();

  if (loading) return <h1>Loading...</h1>;
  return (
    <>
      <section id="dashboard" className="space-y-6 m-3">
        <DeskOverview />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CurrentTaskPanel />
          <ActivityFeed />
          <OpenTicketsList />
        </div>
        <button
          className="btn btn-primary w-fit self-start"
          onClick={addTicket}
        >
          Add Ticket
        </button>
        <button className="btn" onClick={generateTicketFromAI}>
          Test API
        </button>
      </section>
    </>
  );
};

export default Dashboard;
