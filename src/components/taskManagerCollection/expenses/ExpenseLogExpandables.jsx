import {
  Calendar,
  User,
  DollarSign,
  CirclePlus,
  Shapes,
  ChevronDown,
} from "lucide-react";

export default function ExpenseLogExpandables({
  setExpandedLogId,
  expandedLogId,
  log,
  formatCurrency,
  formatYearMonthDay,
}) {
  return (
    <div className="mt-5">
      {/* show less/view details button */}
      <button
        onClick={() =>
          setExpandedLogId(expandedLogId === log._id ? null : log._id)
        }
        className="text-xs text-[#9B2C62] dark:text-[#D97706] hover:underline flex items-center gap-1"
      >
        {expandedLogId === log._id ? "Show less" : "View details"}
        <ChevronDown
          className={`h-3 w-3 transition-transform ${
            expandedLogId === log._id ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* expandable details */}
      {expandedLogId === log._id && (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Left Column - Created Info */}
            <div className="space-y-2">
              {/* Created by */}
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    Created by:
                  </span>
                  <span className="font-medium text-gray-500 dark:text-gray-300">
                    {log.expenseData?.createdBy?.firstName || "Unknown"}
                    {log.expenseData?.createdBy?.lastName &&
                      ` ${log.expenseData.createdBy.lastName}`}
                  </span>
                  {log.expenseData?.createdBy?.role && (
                    <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
                      {log.expenseData.createdBy.role}
                    </span>
                  )}
                </div>
              </div>

              {/* Created on */}
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

              {/* Paid on */}
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

              {/* Due Date */}
              {log.expenseData?.dueDate && !log.expenseData?.paymentDate && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-3 h-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 mr-1">
                      Due on:
                    </span>
                    <span className="font-medium text-gray-500 dark:text-gray-300">
                      {formatYearMonthDay(log.expenseData.dueDate)}
                    </span>
                  </div>
                </div>
              )}

              {/* No payment/due date */}
              {!log.expenseData?.dueDate && !log.expenseData?.paymentDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 mr-1">
                      Date:
                    </span>
                    <span className="font-medium text-gray-500 dark:text-gray-300">
                      No date specified
                    </span>
                  </div>
                </div>
              )}

              {/* Event name */}
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
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Budget & Additional Info */}
            <div className="space-y-2">
              {/* Budget before/after */}
              {log.metadata && (
                <>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3 h-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 mr-1">
                        Budget before:
                      </span>
                      <span className="font-medium text-gray-500 dark:text-gray-300">
                        {formatCurrency(
                          log.metadata.budgetRemainingBefore || 0
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3 h-3 text-green-500 dark:text-green-400 flex-shrink-0" />
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 mr-1">
                        Budget after:
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(log.metadata.budgetRemainingAfter || 0)}
                      </span>
                    </div>
                  </div>
                </>
              )}

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

              {/* No. of changes */}
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

            {/* Full Width - Reason */}
            {log.reason && (
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
                      Reason:
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
