import { createContext, useState } from "react";

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const [currentTask, setCurrentTask] = useState("Idle");
  const [money, setMoney] = useState(0);
  const [name, setName] = useState("Player");

  //player controlling logic here
  //api calls to database to get player information like money, name, profile picture

  return (
    <GameContext.Provider
      value={{
        currentTask,
        setCurrentTask,
        money,
        setMoney,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameProvider };
