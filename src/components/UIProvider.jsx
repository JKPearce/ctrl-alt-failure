"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React from "react";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#6d8eff" },
    secondary: { main: "#bf9fff" },
    error: { main: "#f87171" },
    warning: { main: "#facc15" },
    info: { main: "#4da8f5" },
    success: { main: "#4ade80" },
    background: {
      default: "#0f1115",
      paper: "#141821",
    },
  },
  shape: {
    borderRadius: 10,
  },
});

export default function UIProvider({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
