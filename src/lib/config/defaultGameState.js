//initial game state values (new players will start with these )
export const DEFAULT_BUSINESS_NAME = "UserError Inc.";
export const DEFAULT_INBOX_SIZE = 10;

export const DEFAULT_GAME_STATE = {
  businessName: DEFAULT_BUSINESS_NAME,
  founder: {},
  inboxSize: DEFAULT_INBOX_SIZE,
  gamePhase: "setup", //options are "setup" | "active" | "summary" | "game_over",
  agents: {},
  inbox: {},
  activityLog: [],
  dailySummaries: [],
  currentContract: {},
  dayNumber: 1,
  chaos: 5,
  gameTime: {
    currentTick: 0,
    isPaused: false,
    speed: 1, // 1x, 2x, 3x multiplier
    tickInterval: 1000, // base 1 second
  },
  screams: [],
};
