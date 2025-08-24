import { formatDateTime } from "../taskManagerCollection/utils/formatting";
// handle event status colours
export function EventStatusPill({ status }) {
  return (
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
}

// tasks status colours
export function TaskStatusPill({ status }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full font-medium ${
        status === "Completed"
          ? "bg-green-100 text-green-700"
          : status === "In Review"
          ? "bg-purple-100 text-purple-700"
          : status === "In Progress"
          ? "bg-[#EFF6FF] text-[#1E40AF]"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

// handle date
export function DatePill({ date, status }) {
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
}

// handle tasks priorities
export function TasksPriorityPill({ priority }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full font-medium ${
        priority.toLowerCase() === "high"
          ? "bg-[#F59E0B]/20 text-[#C2410C]"
          : priority.toLowerCase() === "medium"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-gray-200 text-gray-600"
      }`}
    >
      {priority}
    </span>
  );
}

// client is archived
export const IsArchivedCli = () => {
  return (
    <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
      <p className="text-yellow-700 flex items-center gap-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        This client is archived. Their events remain visible but client cannot
        be assigned to new events.
      </p>
    </div>
  );
};

// event client
export const ClientInfo = ({ event, Link }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-gray-500">Client:</span>
      <Link
        to={`/clients/${event.client._id}`}
        className="flex items-center bg-white/80 rounded-lg px-3 py-1 shadow-sm border border-[#F3EDE9] hover:bg-[#FFF5EB] transition-colors duration-200 cursor-default"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-[#9B2C62] mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span className="text-sm font-medium text-[#6B3B0F] hover:text-[#9B2C62] hover:underline transition-colors duration-200">
          {event.client.name}
        </span>
      </Link>
    </div>
  );
};

// event vendors
export const VendorInfo = ({ vendors, Link }) => {
  return (
    <div className="mt-4">
      <h3 className="font-semibold text-gray-500 mb-2 text-sm underline">
        Vendors
      </h3>
      <div className="flex flex-wrap gap-2">
        {vendors.map((vendor, index) => (
          <Link
            to={`/vendors/${vendor._id}`}
            key={index}
            className="cursor-default text-xs font-semibold transition-transform duration-300 hover:-translate-y-0.5"
          >
            <div
              className={`border-2 rounded-lg px-3 py-2 transition-all duration-300
              ${
                vendor.isArchived
                  ? "bg-[#F8D476]/10 border-[#F59E0B]/30"
                  : "bg-[#F8D476]/30 border-[#F59E0B]/50"
              } hover:border-[#F59E0B] hover:shadow-lg hover:shadow-amber-100/50 hover:bg-[#F8D476]/40 group`}
            >
              <span className="text-[#6B3B0F] group-hover:text-amber-900 transition-colors">
                {vendor.name}
              </span>
              <span className="text-[#9B2C62]/80 ml-1 group-hover:text-[#9B2C62] transition-colors">
                - {vendor.services}
              </span>
              {vendor.isArchived && (
                <span className="text-gray-400 text-xs ml-1">(archived)</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
