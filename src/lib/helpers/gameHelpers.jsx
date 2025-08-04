// Game time constants
export const GAME_TIME = {
  DAY_START: 540, // 9:00 AM (9 * 60)
  DAY_END: 1020, // 5:00 PM (17 * 60)
  DAY_LENGTH: 480, // 8 hours (1020 - 540)
  FULL_DAY: 1440, // 24 hours (24 * 60)
};

// Convert game tick to real time
export const formatGameTime = (tick) => {
  const totalMinutes = tick;
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

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

export const getRandomOvernightTime = () => {
  const roll = Math.random();

  if (roll < 0.7) {
    // 70% chance: Evening (17:00 to 23:59)
    return Math.floor(Math.random() * 360) + 1020; // 1020-1379 = 17:00-23:59
  } else {
    // 30% chance: Early morning (00:00 to 9:00)
    return Math.floor(Math.random() * 540); // 0-539 = 00:00-8:59
  }
};
