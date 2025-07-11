import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "./components/Layout.jsx";
import { GameProvider } from "./context/GameContext.jsx";
import { TicketProvider } from "./context/TicketContext.jsx";
import "./index.css";
import { Agents } from "./pages/Agents.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Profile } from "./pages/Profile.jsx";
import { Stats } from "./pages/Stats.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GameProvider>
      <TicketProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/stats" element={<Stats />} />
          </Route>
        </Routes>
      </TicketProvider>
    </GameProvider>
  </BrowserRouter>
);
