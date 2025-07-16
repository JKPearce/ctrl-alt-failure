"use client";

import { useGame } from "@/context";
import {
  DEFAULT_BUSINESS_NAME,
  DEFAULT_PLAYER_NAME,
} from "@/helpers/defaultGameState";
import { useRef } from "react";

export default function Profile() {
  const playerName = useRef();
  const businessName = useRef();
  const { setPlayerName, setBusinessName } = useGame();

  const handleSubmit = (e) => {
    e.preventDefault();
    //TODO:validate and sanitize input here

    setPlayerName(playerName.current.value);
    setBusinessName(businessName.current.value);
  };

  return (
    <section id="profile-page" className="flex flex-col gap-2">
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

        <button type="submit" className="btn btn-success">
          Save
        </button>
      </form>
    </section>
  );
}
