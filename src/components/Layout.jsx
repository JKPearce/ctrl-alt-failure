import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";
import { Nav } from "./Nav";

const Layout = () => {
  return (
    <>
      <Nav />
      <Outlet />
      <Toaster position="bottom-right" />
    </>
  );
};

export { Layout };
