//initial game state values (new players will start with these )
export const DEFAULT_BUSINESS_NAME = "UserError Inc.";
export const DEFAULT_STARTING_MONEY = 1000;
export const DEFAULT_STARTING_ENERGY = 3;
export const DEFAULT_INBOX_SIZE = 10;

export const DEFAULT_GAME_STATE = {
  businessName: DEFAULT_BUSINESS_NAME,
  founder: {},
  money: DEFAULT_STARTING_MONEY,
  energyRemaining: DEFAULT_STARTING_ENERGY,
  inboxSize: DEFAULT_INBOX_SIZE,
  gamePhase: "setup", //options are "setup" | "active" | "summary" | "game_over",
  agents: {},
  inbox: {},
  activityLog: [],
  currentContract: {},
};

export const UPGRADE_DEFINITIONS = {
  coffeeMachine: {
    name: "Covfefe machine", //Donald Trump meme
    cost: 1000,
    modifier: 1.5,
    affects: "actionsRemaining",
    description:
      "Puts a bit of pep in your step, you can now deal with more issues (increase action count by 50%)",
  },
  biggerInbox: {
    name: "Inbox Extendo 9000™",
    cost: 1000,
    modifier: 1.5,
    affects: "inboxSize",
    description:
      "Your email inbox has been upgraded from 'panic-inducing' to 'mildly terrifying'.",
  },
  //more types of unlocks
};
