//initial game state values (new players will start with these )
export const DEFAULT_BUSINESS_NAME = "UserError Inc.";
export const DEFAULT_PLAYER_NAME = "Bob Nullman";
export const DEFAULT_MONEY = 1000;
export const DEFAULT_ACTIONS = 10;
export const DEFAULT_INBOX_SIZE = 10;
export const DEFAULT_UPGRADES = {
  coffeeMachine: false,
  biggerInbox: false,
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
