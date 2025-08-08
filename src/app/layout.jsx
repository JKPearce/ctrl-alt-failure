import { GameProvider } from "@/context/GameContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import UIProvider from "@/components/UIProvider";
import "@/globals.css";

export const metadata = {
  title: "CTRL-ALT-FAIL",
  description: "Manage an IT support company with flair",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="interactive-dark">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body>
        <GameProvider>
          <UIProvider>{children}</UIProvider>
        </GameProvider>
      </body>
    </html>
  );
}
