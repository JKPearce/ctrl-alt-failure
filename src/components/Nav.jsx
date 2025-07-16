"use client";

import { useGame } from "@/lib/hooks/useGame";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Nav = () => {
  const pathname = usePathname();
  const { gameState } = useGame();

  const getLinkClass = (path) =>
    pathname === path
      ? "btn btn-ghost text-secondary border-b-2 border-secondary"
      : "btn btn-ghost hover:text-secondary";

  return (
    <nav className="navbar bg-base-300 text-base-content px-6 shadow-lg">
      <div className="flex-1">
        <Link
          href="/"
          className="btn btn-ghost normal-case text-xl text-primary"
        >
          {gameState.businessName}
        </Link>
      </div>
      <div>
        <p>{gameState.playerName}</p>
      </div>
    </nav>
  );
};

export { Nav };
