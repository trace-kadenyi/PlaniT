import React from "react";

export default function UsersFilter({
  setStatusFilter,
  statusFilter,
  users,
  activeCount,
  inactiveCount,
}) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Filter by status:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              statusFilter === "all"
                ? "bg-[#9B2C62] dark:bg-[#D97706] text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <span>All Users</span>
            <span
              className={`px-1.5 py-0.5 text-xs rounded-full ${
                statusFilter === "all"
                  ? "bg-white/20"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {users.length}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter("active")}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              statusFilter === "active"
                ? "bg-[#9B2C62] dark:bg-[#D97706] text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Active</span>
            </div>
            <span
              className={`px-1.5 py-0.5 text-xs rounded-full ${
                statusFilter === "active"
                  ? "bg-white/20"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {activeCount}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter("inactive")}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              statusFilter === "inactive"
                ? "bg-[#9B2C62] dark:bg-[#D97706] text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Inactive</span>
            </div>
            <span
              className={`px-1.5 py-0.5 text-xs rounded-full ${
                statusFilter === "inactive"
                  ? "bg-white/20"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {inactiveCount}
            </span>
          </button>
        </div>

        {/* Reset filter button (shown when filter is active) */}
        {statusFilter !== "all" && (
          <button
            onClick={() => setStatusFilter("all")}
            className="text-xs text-[#9B2C62] dark:text-[#D97706] hover:underline ml-2"
          >
            Reset filter
          </button>
        )}
      </div>
    </div>
  );
}
