import { useState, useEffect } from "react";
import { UserCheck, Loader2 } from "lucide-react";

export default function UserReactivateConfirmationToast({
  t,
  duration,
  onConfirm,
  onCancel,
  entityName,
}) {
  const [progress, setProgress] = useState(100);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const interval = 10;
    const step = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => Math.max(prev - step, 0));
    }, interval);

    return () => clearInterval(timer);
  }, [duration, isLoading]);

  const handleConfirm = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      await onConfirm();
    } finally {
      // toast dismissed externally
    }
  };

  const handleCancel = () => {
    if (isLoading) return;
    onCancel();
  };

  return (
    <div className="relative p-4 rounded-lg bg-white dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black border-gray-200 shadow-lg max-w-[300px]">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 mt-0.5">
          <UserCheck className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="text-sm text-gray-800 dark:text-gray-300">
            {entityName && (
              <>
                Reactivate{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  “{entityName}”.
                </span>{" "}
              </>
            )}
            This user will regain access to the organization.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className={`px-4 py-1.5 text-sm border rounded-lg transition
            ${
              isLoading
                ? "border-gray-200 text-gray-400 cursor-not-allowed pointer-events-none dark:border-gray-700 dark:bg-gray-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-900"
            }
          `}
        >
          Cancel
        </button>

        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className={`px-4 py-1.5 text-sm text-white rounded-lg transition
            flex items-center justify-center gap-2 min-w-[150px]
            ${
              isLoading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
            }
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Reactivating…
            </>
          ) : (
            "Yes, Reactivate User"
          )}
        </button>
      </div>

      {/* Countdown bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-200 w-full rounded-b-md overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
