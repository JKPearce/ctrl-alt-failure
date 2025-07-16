// src/app/layout.jsx or layout.js
import { Nav } from "@/components/Nav";
import { GameProvider } from "@/context/GameContext";

import "@/globals.css";

export const metadata = {
  title: "IT Desk Sim",
  description: "Manage an IT helpdesk with flair",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GameProvider>
          <Nav />
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
