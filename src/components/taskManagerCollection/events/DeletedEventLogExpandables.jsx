import {
  Calendar,
  User,
  DollarSign,
  CirclePlus,
  Shapes,
  ChevronDown,
  Trash2,
  Archive,
} from "lucide-react";

export default function DeletedEventLogExpandables({
  setExpandedLogId,
  expandedLogId,
  log,
  formatCurrency,
  formatYearMonthDay,
  isDeletedEvent = true,
}) {
  return (
    <div>
      {/* Show Less/View Details Button */}
      <button
        onClick={() =>
          setExpandedLogId(expandedLogId === log._id ? null : log._id)
        }
        className="text-xs hover:underline flex items-center gap-1 text-[#6B3B0F] dark:text-[#F59E0B]"
      >
        {expandedLogId === log._id ? "Show less" : "View details"}
        <ChevronDown
          className={`h-3 w-3 transition-transform ${
            expandedLogId === log._id ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expandable Details */}
      {expandedLogId === log._id && (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Left Column - Created Info */}
            <div className="space-y-2">
              {/* Created By */}
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    Created by:
                  </span>
                  <span className="font-medium text-gray-500 dark:text-gray-300">
                    {log.expenseData?.createdBySnapshot?.firstName || "Unknown"}
                    {log.expenseData?.createdBySnapshot?.lastName &&
                      ` ${log.expenseData.createdBySnapshot.lastName}`}
                  </span>
                  {log.expenseData?.createdBySnapshot?.role && (
                    <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
                      {log.expenseData.createdBySnapshot.role}
                    </span>
                  )}
                </div>
              </div>

              {/* Created On */}
              <div className="flex items-center gap-2">
                <CirclePlus className="w-3 h-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <div>
                  <span className="text-gray-600 dark:text-gray-400 mr-1">
                    Created on:
                  </span>
                  <span className="font-medium text-gray-500 dark:text-gray-300">
                    {formatYearMonthDay(log.expenseData?.createdAt)}
                  </span>
                </div>
              </div>

              {/* Deleted On */}
              {isDeletedEvent && (
                <div className="flex items-center gap-2">
                  <Trash2 className="w-3 h-3 text-red-500 dark:text-red-400 flex-shrink-0" />
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 mr-1">
                      Deleted on:
                    </span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      {formatYearMonthDay(log.createdAt)}
                    </span>
                  </div>
                </div>
              )}

              {/* Paid On */}
              {log.expenseData?.paymentDate && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-3 h-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 mr-1">
                      Paid on:
                    </span>
                    <span className="font-medium text-gray-500 dark:text-gray-300">
                      {formatYearMonthDay(log.expenseData.paymentDate)}
                    </span>
                  </div>
                </div>
              )}

              {/* Event Name */}
              {log.event?.name && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 mr-1">
                      Event:
                    </span>
                    <span className="font-medium text-gray-500 dark:text-gray-300">
                      {log.event.name}
                    </span>
                    <span className="ml-1 text-xs text-gray-400">
                      (Deleted {formatYearMonthDay(log.event.deletedAt)})
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Budget & Additional Info */}
            <div className="space-y-2">
              {/* Vendor */}
              {log.expenseData?.vendor && (
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3 text-gray-500 dark:text-gray-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 mr-1">
                      Vendor:
                    </span>
                    <span className="font-medium text-gray-500 dark:text-gray-300">
                      {log.expenseData.vendor.name}
                    </span>
                  </div>
                </div>
              )}

              {/* Number of Changes */}
              {log.changes && log.changes.length > 0 && (
                <div className="flex items-center gap-2">
                  <Shapes className="w-3 h-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 mr-1">
                      Fields Changed:
                    </span>
                    <span className="font-medium text-gray-500 dark:text-gray-300">
                      {log.changes.length}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Full Width - Reason/Description */}
            {(log.reason || log.expenseData?.description) && (
              <div className="md:col-span-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 mr-1">
                      {log.reason ? "Brief:" : "Description:"}
                    </span>
                    <span className="text-[#6B3B0F] dark:text-gray-300">
                      {log.reason || log.expenseData?.description}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Deletion Reason - Specific to EVENT_DELETE_CASCADE */}
            {isDeletedEvent && log.reason && (
              <div className="md:col-span-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-2">
                  <Archive className="w-3 h-3 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 mr-1">
                      Deletion reason:
                    </span>
                    <span className="text-[#6B3B0F] dark:text-gray-300">
                      {log.reason}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
