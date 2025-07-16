"use client";

import {
  DEFAULT_BUSINESS_NAME,
  DEFAULT_PLAYER_NAME,
} from "@/lib/config/defaultGameState";
import { useGame } from "@/lib/hooks/useGame";
import { useRef } from "react";

function Setup() {
  const { startGame } = useGame();
  const playerName = useRef();
  const businessName = useRef();

  function handleSubmit(e) {
    e.preventDefault();

    startGame(playerName.current.value, businessName.current.value);
  }

  return (
    <>
      <form
        action="submit"
        className="grid grid-cols-2 gap-2"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="playerName">Player Name: </label>
          <input
            type="text"
            name="playerName"
            id="playerName"
            defaultValue={DEFAULT_PLAYER_NAME}
            className="input validator"
            ref={playerName}
            required
          />
        </div>
        <div>
          <label htmlFor="businessName">Business Name: </label>
          <input
            type="text"
            name="businessName"
            id="businessName"
            defaultValue={DEFAULT_BUSINESS_NAME}
            className="input validator"
            ref={businessName}
            required
          />
        </div>

        <button type="submit" className="btn">
          Start Game
        </button>
      </form>
    </>
  );
}

export default Setup;
