"use client";

function useInbox() {
  const createNewMessages = (amount) => {
    //eventually this will be an API call to get a unique ticket / message
    const messages = [];

    for (let i = 0; i < amount; i++) {
      const message = {
        id: 1,
        sender: "Mary",
        subject: "computer no go",
        body: `Hi,
        
        i was trying to write an email but the screen went all blue and then it beeped very loud and now the mouse is gone and the letters are very big and sideways.
        
        pls fix it asap I need to tell brenda about the birthday cake thing and this is very urgent
        
        thx
        Mary`,
        received: Date.now(),
      };
      messages.push(message);
    }

    return messages;
  };

  return { createNewMessages };
}

export { useInbox };
