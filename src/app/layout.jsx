// src/app/layout.jsx or layout.js
import { Nav } from "@/components/Nav";
import { GameProvider, TicketProvider } from "@/context";
import "@/globals.css";

export const metadata = {
  title: "IT Desk Sim",
  description: "Manage an IT helpdesk with flair",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TicketProvider>
          <GameProvider>
            <Nav />
            {children}
          </GameProvider>
        </TicketProvider>
      </body>
    </html>
  );
}
