export function formatGameTime(gameTicks) {
  // Clamp to workday (0-480 minutes)
  const clampedMinutes = Math.min(gameTicks, 480);

  // Add to 9:00 AM start time (540 minutes since midnight)
  const totalMinutes = 540 + clampedMinutes;

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}
