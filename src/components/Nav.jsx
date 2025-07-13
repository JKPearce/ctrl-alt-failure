"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Nav = () => {
  const pathname = usePathname();

  const getLinkClass = (path) =>
    pathname === path
      ? "btn btn-ghost text-secondary border-b-2 border-secondary"
      : "btn btn-ghost hover:text-secondary";

  return (
    <div className="navbar bg-base-300 text-base-content px-6 shadow-lg">
      <div className="flex-1">
        <Link
          href="/"
          className="btn btn-ghost normal-case text-xl text-primary"
        >
          IT Desk Sim
        </Link>
      </div>
      <div className="flex-none space-x-2">
        <Link href="/" className={getLinkClass("/")}>
          Dashboard
        </Link>
        <Link href="/agents" className={getLinkClass("/agents")}>
          Agents
        </Link>
        <Link href="/profile" className={getLinkClass("/profile")}>
          Profile
        </Link>
        <Link href="/stats" className={getLinkClass("/stats")}>
          Stats
        </Link>
      </div>
    </div>
  );
};

export { Nav };
