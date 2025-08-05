import { AlertTriangle } from "lucide-react";

export function ErrorState({
  message = "Oops! Something went wrong.",
  action,
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="bg-red-100 p-2 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            We encountered a problem
          </h3>
          <p className="text-gray-600 mb-4">{message}</p>
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
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
      <p>
        {error} || {message}
      </p>
    </div>
  );
}
