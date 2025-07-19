// src/app/layout.jsx or layout.js
import { GameProvider } from "@/context/GameContext";

import "@/globals.css";

export const metadata = {
  title: "CTRL-ALT-FAIL",
  description: "Manage an IT support company with flair",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="coffee">
      <body>
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
