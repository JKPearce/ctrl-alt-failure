import { Outlet } from "react-router";
import { Nav } from "./Nav";

const Layout = () => {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
};

export { Layout };
