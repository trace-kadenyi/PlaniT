import { formatDateTime } from "../taskManagerCollection/utils/formatting";
// handle event status colours
export function EventStatusPill({ status }) {
  return (
    <span
      className={`px-2 py-1 rounded text-xs ${
        status === "Completed"
          ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100"
          : status === "Cancelled"
          ? "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100"
          : status === "In Progress"
          ? "bg-[#F5EBFF] text-[#9B2C62] dark:bg-purple-900/40 dark:text-purple-200"
          : "bg-[#EFF6FF] text-[#1E40AF] dark:bg-blue-900/30 dark:text-blue-300"
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
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
          : status === "In Review"
          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
          : status === "In Progress"
          ? "bg-[#EFF6FF] text-[#1E40AF] dark:bg-blue-900/30 dark:text-blue-300"
          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
      }`}
    >
      {status}
    </span>
  );
}

// Dashboards Progress Bar
export function DashEventsBar(status) {
  if (status === "Completed") return "bg-green-500";
  if (status === "Cancelled") return "bg-red-400";
  if (status === "In Progress") return "bg-[#9B2C62]/60 dark:bg-[#9B2C62]";
  return "bg-blue-400";
}

// Tasks Progress Bar
export function DashTasksBar(status) {
  if (status === "Completed") return "bg-emerald-500";
  if (status === "In Review") return "bg-purple-500";
  if (status === "In Progress") return "bg-[#F59E0B]";
  return "bg-gray-500";
}

// handle date
export function DatePill({ date, status }) {
  const baseStyles =
    "px-3 py-1 rounded-full text-xs font-medium inline-flex items-center";

  const statusStyles = {
    Completed:
      "bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50",
    Cancelled:
      "bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50",
    "In Progress":
      "bg-[#F5EBFF] text-[#9B2C62] border border-[#EEDDFF] dark:bg-[#4A1D96]/30 dark:text-[#F9A8D4] dark:border-[#5B21B6]/50",
    Planning:
      "bg-[#EFF6FF] text-[#1E40AF] border border-[#DBEAFE] dark:bg-[#1E3A8A]/30 dark:text-[#93C5FD] dark:border-[#1D4ED8]/50",
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
  // if (priority.toLowerCase() === "high") {
  //   return null;
  // }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full font-medium ${
        priority.toLowerCase() === "high"
          ? "bg-[#F59E0B]/20 text-[#C2410C] dark:bg-red-900 dark:text-red-200"
          : priority.toLowerCase() === "medium"
          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200"
          : "bg-gray-200 text-gray-600 dark:bg-gray-800/50 dark:text-gray-300"
      }`}
    >
      {priority}
    </span>
  );
}

// client is archived
export function IsArchivedCli() {
  return (
    <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-50/10 border-l-4 border-yellow-400 rounded-lg">
      <p className="text-yellow-700 dark:text-[#F59E0B] flex items-center gap-2">
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
}

// event client
export function ClientInfo({ event, Link }) {
  const client = event.client;
  const isDeleted = client?.isDeleted;
  const clientName = client?.name || "Client Deleted";
  const clientId = client?._id;

  const ClientContent = () => (
    <div
      className={`flex items-center rounded-lg px-3 py-1 shadow-sm border transition-colors duration-200 ${
        isDeleted || !client
          ? "bg-gray-100 border-gray-300 text-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
          : "bg-white/80 border-[#F3EDE9] hover:bg-[#FFF5EB] dark:bg-gray-900/10 dark:hover:bg-gray-900 dark:border-[#F59E0B]/40 cursor-default"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-4 w-4 mr-1 ${
          isDeleted || !client
            ? "text-gray-400 dark:text-gray-500"
            : "text-[#9B2C62] dark:text-[#F59E0B]"
        }`}
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
      <span
        className={`text-sm font-medium transition-colors duration-200 ${
          isDeleted || !client
            ? "text-gray-500 dark:text-gray-400 line-through"
            : "text-[#6B3B0F] hover:text-[#9B2C62] hover:underline dark:text-[#F59E0B] dark:hover:text-[#F59E0B]"
        }`}
      >
        {clientName}
      </span>
      {(isDeleted || !client) && (
        <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">
          (Deleted)
        </span>
      )}
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-300">
        Client:
      </span>
      {isDeleted || !clientId ? (
        <ClientContent />
      ) : (
        <Link to={`/clients/${clientId}`}>
          <ClientContent />
        </Link>
      )}
    </div>
  );
}

// event vendors
export function VendorInfo({ vendors, Link }) {
  return (
    <div className="mt-4">
      <h3 className="font-semibold text-gray-500 dark:text-gray-300 mb-2 text-sm underline">
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
                  ? "bg-[#F8D476]/10 border-[#F59E0B]/30 dark:bg-[#F8D476]/10 dark:border-[#F59E0B]/70"
                  : "bg-[#F8D476]/30 border-[#F59E0B]/50 dark:bg-[#F8D476]/10 dark:border-[#F59E0B]/50"
              } hover:border-[#F59E0B] hover:shadow-lg hover:shadow-amber-100/50 hover:bg-[#F8D476]/40 group dark:hover:shadow-gray-900 dark:hover:bg-[#F8D476]/10`}
            >
              <span className="text-[#6B3B0F] group-hover:text-amber-900 dark:text-amber-600 dark:group-hover:text-amber-600 transition-colors">
                {vendor.name}
              </span>
              <span className="text-[#9B2C62]/80 dark:text-amber-400 ml-1 transition-colors">
                - {vendor.services}
              </span>
              {vendor.isArchived && (
                <span className="text-gray-400 dark:text-gray-300/80 text-xs ml-1">
                  (archived)
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
