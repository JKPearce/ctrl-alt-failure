"use client";

import { useGame } from "@/context/useGame";
import {
  AlertTriangle,
  Award,
  CheckCircle,
  Crown,
  Trash2,
  XCircle,
} from "lucide-react";

const GameOver = () => {
  const { gameState, restartGame } = useGame();
  const {
    businessName,
    founder,
    money,
    inbox,
    inboxSize,
    agents,
    dayNumber,
    dailySummaries,
    currentContract,
    openComplaints,
  } = gameState;

  // Calculate comprehensive stats
  const inboxItems = Object.values(inbox);
  const activeItems = inboxItems.filter((item) => item.activeItem);

  // Overall stats
  const totalTicketsResolved = inboxItems.filter(
    (item) => item.resolved && item.messageType === "ticket"
  ).length;
  const totalTicketsFailed = inboxItems.filter(
    (item) => item.failCount > 0 && item.messageType === "ticket"
  ).length;
  const totalSpamDeleted = inboxItems.filter(
    (item) => !item.activeItem && item.messageType === "spam"
  ).length;
  const totalComplaints = dailySummaries.reduce(
    (sum, day) => sum + day.complaints,
    0
  );
  const contractsCompleted =
    dailySummaries.length > 0 ? Math.floor(totalTicketsResolved / 15) : 0; // Assuming 15 tickets per contract average

  // Agent performance stats
  const agentStats = {};
  Object.values(agents).forEach((agent) => {
    agentStats[agent.agentName] = {
      resolved: 0,
      failed: 0,
      agent: agent,
    };
  });

  // Calculate agent stats from inbox items
  inboxItems.forEach((item) => {
    if (item.resolvedBy && agentStats[agents[item.resolvedBy]?.agentName]) {
      agentStats[agents[item.resolvedBy].agentName].resolved++;
    }
    if (
      item.failCount > 0 &&
      item.agentAssigned &&
      agentStats[agents[item.agentAssigned]?.agentName]
    ) {
      agentStats[agents[item.agentAssigned].agentName].failed++;
    }
  });

  // Find MVP and worst performer
  const agentPerformance = Object.entries(agentStats)
    .map(([name, stats]) => ({
      name,
      ...stats,
      total: stats.resolved + stats.failed,
      successRate:
        stats.total > 0 ? ((stats.resolved / stats.total) * 100).toFixed(1) : 0,
    }))
    .filter((agent) => agent.total > 0);

  const mvpAgent = agentPerformance.reduce(
    (best, current) => (current.resolved > best.resolved ? current : best),
    agentPerformance[0] || {}
  );

  const worstAgent = agentPerformance.reduce(
    (worst, current) =>
      current.failed > worst.failed ||
      (current.failed === worst.failed &&
        current.successRate < worst.successRate)
        ? current
        : worst,
    agentPerformance[0] || {}
  );

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-6xl bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
              <AlertTriangle className="w-10 h-10 text-error" />
              Inbox Overflow!
            </h1>
            <p className="text-xl text-base-content/80 mb-2">
              {businessName} collapsed under the weight of unresolved tickets
            </p>
            <p className="text-sm opacity-60">
              Founded by {founder.name} • Survived {dayNumber} days •{" "}
              {activeItems.length}/{inboxSize} inbox overflow
            </p>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-figure text-success">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Tickets Resolved</div>
              <div className="stat-value text-success">
                {totalTicketsResolved}
              </div>
            </div>

            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-figure text-error">
                <XCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Tickets Failed</div>
              <div className="stat-value text-error">{totalTicketsFailed}</div>
            </div>

            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-figure text-info">
                <Trash2 className="w-8 h-8" />
              </div>
              <div className="stat-title">Spam Deleted</div>
              <div className="stat-value text-info">{totalSpamDeleted}</div>
            </div>

            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-figure text-warning">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="stat-title">Complaints</div>
              <div className="stat-value text-warning">{totalComplaints}</div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Company Performance */}
            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title text-lg">Company Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Contracts Completed:</span>
                    <span className="font-bold">{contractsCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Money Remaining:</span>
                    <span className="font-bold text-success">${money}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Open Complaints:</span>
                    <span className="font-bold text-error">
                      {openComplaints}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-bold">
                      {totalTicketsResolved + totalTicketsFailed > 0
                        ? (
                            (totalTicketsResolved /
                              (totalTicketsResolved + totalTicketsFailed)) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* MVP Agent */}
            {mvpAgent && (
              <div className="card bg-success/10 border border-success/20">
                <div className="card-body">
                  <h3 className="card-title text-lg flex items-center gap-2">
                    <Crown className="w-5 h-5 text-warning" />
                    MVP Agent
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img
                          src={mvpAgent.agent?.profileImage}
                          alt={mvpAgent.name}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{mvpAgent.name}</div>
                      <div className="text-sm opacity-70">
                        {mvpAgent.agent?.nickName}
                      </div>
                      <div className="text-xs">
                        {mvpAgent.resolved} resolved • {mvpAgent.successRate}%
                        success rate
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Worst Performer */}
            {worstAgent && worstAgent !== mvpAgent && (
              <div className="card bg-error/10 border border-error/20">
                <div className="card-body">
                  <h3 className="card-title text-lg">Needs Improvement</h3>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img
                          src={worstAgent.agent?.profileImage}
                          alt={worstAgent.name}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{worstAgent.name}</div>
                      <div className="text-sm opacity-70">
                        {worstAgent.agent?.nickName}
                      </div>
                      <div className="text-xs">
                        {worstAgent.failed} failed • {worstAgent.successRate}%
                        success rate
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Team Performance */}
          <div className="card bg-base-200 mb-8">
            <div className="card-body">
              <h3 className="card-title">Team Performance</h3>
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Agent</th>
                      <th>Resolved</th>
                      <th>Failed</th>
                      <th>Success Rate</th>
                      <th>Skills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentPerformance.map((agent) => (
                      <tr
                        key={agent.name}
                        className={
                          agent === mvpAgent
                            ? "bg-success/20"
                            : agent === worstAgent
                            ? "bg-error/20"
                            : ""
                        }
                      >
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="avatar">
                              <div className="w-8 rounded-full">
                                <img
                                  src={agent.agent?.profileImage}
                                  alt={agent.name}
                                />
                              </div>
                            </div>
                            <span className="font-semibold">{agent.name}</span>
                            {agent === mvpAgent && (
                              <Crown className="w-4 h-4 text-warning" />
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-success badge-sm">
                            {agent.resolved}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-error badge-sm">
                            {agent.failed}
                          </span>
                        </td>
                        <td>{agent.successRate}%</td>
                        <td className="text-xs">
                          HW: {agent.agent?.skills.hardware} | SW:{" "}
                          {agent.agent?.skills.software}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 mb-8">
            <div className="card-body">
              <h3 className="card-title">📊 Final Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-bold">Total Items Processed:</span>
                  <div className="text-lg">{inboxItems.length}</div>
                </div>
                <div>
                  <span className="font-bold">Chaos Level:</span>
                  <div className="text-lg">{gameState.chaos}/100</div>
                </div>
                <div>
                  <span className="font-bold">Team Size:</span>
                  <div className="text-lg">
                    {Object.keys(agents).length} agents
                  </div>
                </div>
                <div>
                  <span className="font-bold">Current Contract:</span>
                  <div className="text-sm">
                    {currentContract?.name || "None"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Restart Button */}
          <div className="text-center">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => restartGame()}
            >
              🔄 Start New Company
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
