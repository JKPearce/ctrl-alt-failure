export function formatGameTime(gameMinutes) {
  const total = 540 + gameMinutes; //540 = starting at 9:00AM
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}
