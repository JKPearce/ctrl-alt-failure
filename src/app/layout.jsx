import { GameProvider } from "@/context/GameContext";

import UIProvider from "@/components/UIProvider";
import "@/globals.css";

export const metadata = {
  title: "CTRL-ALT-FAIL",
  description: "Manage an IT support company with flair",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="interactive-dark">
      <body>
        <GameProvider>
          <UIProvider>{children}</UIProvider>
        </GameProvider>
      </body>
    </html>
  );
}
