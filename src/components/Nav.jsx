import { NavLink } from "react-router";

const Nav = () => {
  const linkClasses = ({ isActive }) =>
    isActive
      ? "btn btn-ghost text-secondary border-b-2 border-secondary"
      : "btn btn-ghost hover:text-secondary";

  return (
    <div className="navbar bg-base-300 px-4 shadow-lg">
      {/* Left side: brand + mobile hamburger */}
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <NavLink
            to="/"
            className="btn btn-ghost normal-case text-xl text-primary"
          >
            IT Desk Sim
          </NavLink>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52"
          >
            <li>
              <NavLink to="/">Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/agents">Agents</NavLink>
            </li>
            <li>
              <NavLink to="/profile">Profile</NavLink>
            </li>
            <li>
              <NavLink to="/stats">Stats</NavLink>
            </li>
          </ul>
        </div>
      </div>

      {/* Center: menu for large screens */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-2">
          <li>
            <NavLink to="/" end className={linkClasses}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/agents" className={linkClasses}>
              Agents
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={linkClasses}>
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="/stats" className={linkClasses}>
              Stats
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Right side: optional actions */}
      <div className="navbar-end">
        {/* You could add profile avatar or theme switcher here */}
      </div>
    </div>
  );
};

export { Nav };
