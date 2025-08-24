// format date time local
export function formatForDateTimeLocal(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  // Adjust for timezone offset to display correctly
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

// parse from date time local
export function parseFromDateTimeLocal(localString) {
  if (!localString) return null;
  // Convert back to proper ISO format for backend
  return new Date(localString).toISOString();
}

// format local date time for display
export function formatLocalDateTimeForDisplay(date) {
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// get localdatetime string
export const getLocalDateTimeString = () => {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;
  const localTime = new Date(now - timezoneOffset);
  return localTime.toISOString().slice(0, 16);
};
