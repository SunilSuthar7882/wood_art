export function convertTo12Hour(time) {
  let [hours, minutes, seconds] = time.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;

  return formattedTime;
}
