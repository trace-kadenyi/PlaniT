// loading dashboard
export const LoadingDashboard = () => (
  <div className="flex space-x-4 animate-pulse justify-center">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="bg-gray-100 dark:bg-gray-700/60 rounded-lg p-4 w-80 h-64"
      ></div>
    ))}
  </div>
);

// fetch dashboard error
export const FetchDashboardError = ({ message, fetchError }) => (
  <div className="p-3 bg-red-50 dark:bg-red-200 text-red-600 rounded mb-4">
    {message}: {fetchError}
  </div>
);

// update dashboard error
export const UpdateDashboardError = ({ updateError, dispatch, clearError }) => (
  <div className="p-3 bg-red-50 dark:bg-red-200 text-red-600 rounded mb-4 flex justify-between">
    <span>Update failed: {updateError}</span>
    <button
      onClick={() => dispatch(clearError())}
      className="text-[#9B2C62] font-medium"
    >
      Cancel
    </button>
  </div>
);

// urgency helpers
const normalize = (d) => {
  const n = new Date(d);
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
};

export const getUrgency = (
  date,
  status,
  inactiveStatuses = ["Completed", "Cancelled"],
) => {
  if (inactiveStatuses.includes(status)) return null;

  const eventDate = normalize(date);
  const now = normalize(new Date());

  const diffDays = Math.round((eventDate - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  if (diffDays <= 7) return `days:${diffDays}`;

  return null;
};

export const getUrgencyDisplay = (urgency) => {
  if (!urgency) return null;
  if (urgency === "overdue") return { label: "Overdue", color: "red" };
  if (urgency === "today") return { label: "Due today", color: "red" };
  if (urgency === "tomorrow") return { label: "Tomorrow", color: "amber" };
  if (urgency.startsWith("days:")) {
    const days = urgency.split(":")[1];
    return { label: `Due in ${days} days`, color: "amber" };
  }
  return null;
};
