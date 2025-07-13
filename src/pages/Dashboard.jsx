import { ActivityFeed } from "../components/dashboard/ActivityFeed";
import { CurrentTaskPanel } from "../components/dashboard/CurrentTaskPanel";
import { DeskOverview } from "../components/dashboard/DeskOverview";
import { OpenTicketsList } from "../components/dashboard/OpenTicketList";
import { useTicket } from "../context/useTicket";

const Dashboard = () => {
  const { loading, addTicket } = useTicket();

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
      </section>
    </>
  );
};

export { Dashboard };
