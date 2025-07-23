import { LOG_TYPES } from "../config/actionTypes";

export const summariseDay = ({ activityLog, inbox, agents }, dayNumber) => {
  // limit to events that happened *today*
  const todayEvents = activityLog.filter((e) => e.day === dayNumber);

  const summary = {
    day: dayNumber,
    resolved: 0,
    failed: 0,
    complaints: 0,
    agentStats: {}, // id -> { resolves, fails }
  };

  todayEvents.forEach((e) => {
    switch (e.eventType) {
      case LOG_TYPES.RESOLVE_SUCCESS:
        summary.resolved++;
        inc(summary.agentStats, e.actor, "resolves");
        break;
      case LOG_TYPES.RESOLVE_FAIL:
        summary.failed++;
        inc(summary.agentStats, e.actor, "fails");
        break;
      case LOG_TYPES.COMPLAINT_CREATED: // add when you have that event
        summary.complaints++;
        break;
      default:
        break;
    }
  });

  // find MVP / flop (optional)
  const agentsArr = Object.entries(summary.agentStats);
  agentsArr.sort((a, b) => (b[1].resolves || 0) - (a[1].resolves || 0));

  summary.mvp = agentsArr[0]?.[0] ?? null;
  summary.flop = agentsArr[agentsArr.length - 1]?.[0] ?? null;

  return summary;
};

function inc(obj, name, key) {
  obj[name] ??= { resolves: 0, fails: 0 };
  obj[name][key]++;
}
