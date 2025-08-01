import { formatDateTime } from "../taskManagerCollection/utils/formatting";
// handle event status colours
export const StatusPill = ({ status }) => (
  <span
    className={`px-2 py-1 rounded text-xs ${
      status === "Completed"
        ? "bg-green-100 text-green-800"
        : status === "Cancelled"
        ? "bg-red-100 text-red-800"
        : status === "In Progress"
        ? "bg-[#F5EBFF] text-[#9B2C62]"
        : "bg-[#EFF6FF] text-[#1E40AF]"
    }`}
  >
    {status}
  </span>
);

// handle date
export const DatePill = ({ date, status }) => {
  const baseStyles =
    "px-3 py-1 rounded-full text-xs font-medium inline-flex items-center";

  const statusStyles = {
    Completed: "bg-green-50 text-green-700 border border-green-100",
    Cancelled: "bg-red-50 text-red-700 border border-red-100",
    "In Progress": "bg-[#F5EBFF] text-[#9B2C62] border border-[#EEDDFF]",
    Planning: "bg-[#EFF6FF] text-[#1E40AF] border border-[#DBEAFE]",
  };

  return (
    <time
      dateTime={new Date(date).toISOString()}
      className={`${baseStyles} ${
        statusStyles[status] || statusStyles.Planning
      } transition-all hover:scale-[1.02]`}
      title={formatDateTime(date)} // Full format as tooltip
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-3.5 mr-1.5 opacity-70"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      {formatDateTime(date)}
    </time>
  );
};
