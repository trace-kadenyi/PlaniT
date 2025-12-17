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
export function getLocalDateTimeString() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;
  const localTime = new Date(now - timezoneOffset);
  return localTime.toISOString().slice(0, 16);
}

// format dashboard dates
export const formatDashDate = (dateString) => {
  if (!dateString) return "No date";
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 0) return "Overdue";
  if (diffDays < 7) return `Due in ${diffDays} days`;
  if (diffDays < 30) return `Due in ${Math.floor(diffDays / 7)} weeks`;
  return date.toLocaleDateString("default", {
    month: "short",
    day: "numeric",
  });
};

// get date badge class
export const getDateBadgeClass = (date) => {
  const formattedDate = formatDashDate(date);

  const isUrgent =
    formattedDate.includes("day") ||
    formattedDate.includes("Tomorrow") ||
    formattedDate.includes("Today") ||
    formattedDate.includes("Overdue");

  const baseClasses = "text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2";

  const urgentClasses =
    "text-red-600 font-semibold bg-red-200 dark:bg-red-400/10";

  const normalClasses = "text-[#9B2C62] dark:text-[#F59E0B] bg-[#F59E0B]/10";

  return `${baseClasses} ${isUrgent ? urgentClasses : normalClasses}`;
};
