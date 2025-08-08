"use client";

import { useCallback, useMemo } from "react";

function playBeep({
  frequency = 440,
  durationMs = 120,
  volume = 0.2,
  type = "triangle",
}) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    // Envelope for softer notification shape
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(now + durationMs / 1000);
    osc.onended = () => ctx.close();
  } catch {
    // ignore if AudioContext fails (e.g., SSR or blocked autoplay)
  }
}

export default function useSound() {
  const playAssign = useCallback(
    () => playBeep({ frequency: 720, durationMs: 110 }),
    []
  );
  const playDelete = useCallback(
    () => playBeep({ frequency: 280, durationMs: 140 }),
    []
  );
  const playPause = useCallback(
    () => playBeep({ frequency: 240, durationMs: 120 }),
    []
  );
  const playResume = useCallback(
    () => playBeep({ frequency: 540, durationMs: 120 }),
    []
  );
  // Two-tone chimes for notifications
  const playChime = (f1, f2) => {
    playBeep({
      frequency: f1,
      durationMs: 120,
      volume: 0.18,
      type: "triangle",
    });
    setTimeout(
      () =>
        playBeep({
          frequency: f2,
          durationMs: 140,
          volume: 0.18,
          type: "triangle",
        }),
      90
    );
  };
  const playNewInbox = useCallback(() => playChime(660, 880), []);
  const playNewScream = useCallback(() => playChime(520, 390), []);

  return useMemo(
    () => ({
      playAssign,
      playDelete,
      playPause,
      playResume,
      playNewInbox,
      playNewScream,
    }),
    [playAssign, playDelete, playPause, playResume, playNewInbox, playNewScream]
  );
}
