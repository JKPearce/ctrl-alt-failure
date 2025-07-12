import { useTicket } from "../../context/useTicket";

const DeskOverview = () => {
  const { ticketList } = useTicket();

  const openCount = ticketList.filter((t) => t.state === "Open").length;
  const wipCount = ticketList.filter(
    (t) => t.state === "Work in Progress"
  ).length;
  const resolvedCount = ticketList.filter((t) => t.state === "Resolved").length;

  return (
    <section id="desk-overview" className="min-w-max">
      <div className="stats bg-base-200 text-base-content shadow-lg rounded-xl w-full divide-x divide-primary/80 text-center overflow-hidden">
        <div className="stat px-6 transition-transform duration-300 hover:scale-105">
          <div className="stat-figure text-primary text-2xl">📩</div>
          <div className="stat-title">Open Tickets</div>
          <div className="stat-value">{openCount}</div>
        </div>

        <div className="stat px-6 border-l border-primary/30 transition-transform duration-300 hover:scale-105">
          <div className="stat-figure text-secondary text-2xl">⚙️</div>
          <div className="stat-title">In Progress</div>
          <div className="stat-value">{wipCount}</div>
        </div>

        <div className="stat border-l border-primary/30 px-6 transition-transform duration-300 hover:scale-105">
          <div className="stat-figure text-accent text-2xl">✅</div>
          <div className="stat-title">Resolved Tickets</div>
          <div className="stat-value">{resolvedCount}</div>
        </div>
      </div>
    </section>
  );
};

export { DeskOverview };
