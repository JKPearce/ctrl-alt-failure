import { NavLink } from "react-router";

const Nav = () => {
  const linkClasses = ({ isActive }) =>
    isActive
      ? "btn btn-ghost text-secondary border-b-2 border-secondary"
      : "btn btn-ghost hover:text-secondary";

  return (
    <div className="navbar bg-base-300 text-base-content px-6 shadow-lg">
      <div className="flex-1">
        <NavLink
          to="/"
          className="btn btn-ghost normal-case text-xl text-primary"
        >
          IT Desk Sim
        </NavLink>
      </div>
      <div className="flex-none space-x-2">
        <NavLink to="/" end className={linkClasses}>
          Dashboard
        </NavLink>
        <NavLink to="/agents" className={linkClasses}>
          Agents
        </NavLink>
        <NavLink to="/profile" className={linkClasses}>
          Profile
        </NavLink>
        <NavLink to="/stats" className={linkClasses}>
          Stats
        </NavLink>
      </div>
    </div>
  );
};

export { Nav };
