export const formatForDateTimeLocal = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  // Adjust for timezone offset to display correctly
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};

export const parseFromDateTimeLocal = (localString) => {
  if (!localString) return null;
  // Convert back to proper ISO format for backend
  return new Date(localString).toISOString();
};


const formatLocalDateTimeForDisplay = (date) => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };


  