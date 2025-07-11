import { NavLink } from "react-router";

const Nav = () => {
  const navLinkClasses = ({ isActive }) =>
    isActive
      ? "text-yellow-300 font-semibold underline"
      : "hover:text-yellow-200";

  return (
    <nav className="bg-gray-800 text-white px-4 py-2">
      <ul className="flex space-x-4">
        <li>
          <NavLink to="/" end className={navLinkClasses}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/agents" className={navLinkClasses}>
            Agents
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={navLinkClasses}>
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/stats" className={navLinkClasses}>
            Statistics
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export { Nav };
