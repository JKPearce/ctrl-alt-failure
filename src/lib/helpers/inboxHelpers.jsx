const createNewMessages = (amount) => {
  //eventually this will be an API call to get a unique ticket / message
  const messages = {};

  for (let i = 0; i < amount; i++) {
    messages[i] = {
      id: i,
      type: "ticket", //multiple types of messages "ticket" for something that can be assigned "spam" for a funny flavour spam email "feedback" comments on a resolved ticket etc
      stepsRemaining: 4,
      agentAssigned: null,
      sender: "Mary",
      subject: "computer no go",
      body: `Hi,
        
        i was trying to write an email but the screen went all blue and then it beeped very loud and now the mouse is gone and the letters are very big and sideways.
        
        pls fix it asap I need to tell brenda about the birthday cake thing and this is very urgent
        
        thx
        Mary`,
      received: Date.now(),
    };
  }

  return messages;
};

export { createNewMessages };
