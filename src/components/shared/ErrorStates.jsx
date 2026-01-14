import { AlertTriangle, FileText } from "lucide-react";

// error state func
export function ErrorState({
  message = "Oops! Something went wrong.",
  action,
}) {
  return (
    <div className="bg-white dark:bg-red-300 rounded-xl shadow-lg p-6 border-l-4 border-red-500">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="bg-red-100 dark:bg-red-200 p-2 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            We encountered a problem
          </h3>
          <p className="text-gray-600 dark:text-gray-700 mb-4">{message}</p>
          {action && (
            <div className="mt-4">
              {typeof action === "string" ? (
                <button
                  onClick={action.onClick}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {action}
                </button>
              ) : (
                action
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// gen error state
export function GenErrorState({ error, message }) {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded dark:bg-red-300 flex items-start">
      <div className="mr-3 mt-0.5 flex-shrink-0">
        <svg
          className="h-5 w-5 text-red-500 dark:text-red-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p>{error || message}</p>
    </div>
  );
}

// audit logs error state
export function AuditLogsErrorState({
  auditLogError,
  dispatch,
  fetchExpenseAuditLogs,
  eventId,
}) {
  return (
    <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-8 border border-[#F3EDE9] dark:border-gray-700 text-center">
      <div className="mx-auto max-w-sm flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
          <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
          Error loading audit logs
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {auditLogError || "Failed to load audit logs"}
        </p>
        <button
          onClick={() => dispatch(fetchExpenseAuditLogs({ eventId }))}
          className="mt-4 px-4 py-2 text-sm bg-[#9B2C62] hover:bg-[#801f4f] text-white rounded-md transition"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
