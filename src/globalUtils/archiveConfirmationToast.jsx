import { useState, useEffect } from "react";
import { Archive, RefreshCcw, Loader2 } from "lucide-react";

export default function ArchiveConfirmationToast({
  t,
  duration,
  onConfirm,
  onCancel,
  isArchived = false,
}) {
  const [progress, setProgress] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const action = isArchived ? "restore" : "archive";

  // toast messages
  const messages = {
    archive: {
      warning:
        "This will archive the vendor. Archived vendors won't appear in regular listings.",
      confirm: "Yes, Archive Vendor",
      icon: <Archive className="w-5 h-5 text-[#9B2C62]" />,
    },
    restore: {
      warning: "This will restore the vendor to active status.",
      confirm: "Yes, Restore Vendor",
      icon: <RefreshCcw className="w-5 h-5 text-green-600" />,
    },
  };

  useEffect(() => {
    if (isLoading) return; // ⛔ pause countdown while confirming

    const interval = 10;
    const step = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => Math.max(prev - step, 0));
    }, interval);

    return () => clearInterval(timer);
  }, [duration, isLoading]);

  // handle confirm
  const handleConfirm = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await onConfirm();
    } finally {
      // Do NOT reset isLoading here
      // Toast will be dismissed externally on success/error
    }
  };

  // handle cancel
  const handleCancel = () => {
    if (isLoading) return;
    onCancel();
  };

  return (
    <div className="relative p-4 rounded-lg bg-white border border-gray-200 shadow-lg max-w-[300px] dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black dark:border-gray-600">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 mt-0.5">{messages[action].icon}</div>
        <p className="text-sm text-gray-800 dark:text-gray-300">
          {messages[action].warning}
        </p>
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className={`px-4 py-1.5 text-sm border rounded-lg transition
    ${
      isLoading
        ? "border-gray-200 text-gray-400 cursor-not-allowed pointer-events-none dark:border-gray-700 bg:gray-600 dark:bg-gray-700"
        : "border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-900"
    }
  `}
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className={`px-4 py-1.5 text-sm text-white rounded-lg transition flex items-center justify-center gap-2 min-w-[150px] ${
            action === "archive"
              ? "bg-[#9B2C62] hover:bg-[#801f4f]"
              : "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
          }  ${
            isLoading
              ? action === "restore"
                ? "bg-green-400 cursor-not-allowed"
                : "bg-[#9B2C62]/70 cursor-not-allowed"
              : action === "restore"
                ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                : "bg-[#9B2C62] hover:bg-[#801f4f] dark:bg-[#9B2C62] dark:hover:bg-[#801f4f]"
          }
`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {action === "archive" ? "Archiving…" : "Restoring…"}
            </>
          ) : (
            messages[action].confirm
          )}
        </button>
      </div>
      {/* Countdown bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-200 w-full rounded-b-md overflow-hidden">
        <div
          className={`h-full transition-all duration-100 ${
            action === "archive" ? "bg-[#9B2C62]" : "bg-green-600"
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
