import { useState, useEffect } from "react";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteConfirmationToast({
  t,
  duration,
  onConfirm,
  onCancel,
  type = "event", // 'event' or 'task'
  expensePaymentStatus,
}) {
  const [progress, setProgress] = useState(100);
  const [isLoading, setIsLoading] = useState(false);

  const messages = {
    event: {
      warning:
        "This action will permanently delete the event and all associated tasks.",
      confirm: "Yes, Delete Event",
    },
    task: {
      warning: "This will permanently delete the task.",
      confirm: "Yes, Delete Task",
    },
    expense: {
      warning: "This will permanently delete the expense.",
      confirm: "Yes, Delete Expense",
    },
    paid_expense: {
      warning:
        "⚠️ You are about to delete a PAID expense. This action will be logged in the audit trail and cannot be reversed.",
      confirm: "Yes, Delete Paid Expense",
      note: "Only super administrators can delete paid expenses.",
    },
    client: {
      warning: "This will permanently delete the client.",
      confirm: "Yes, Delete Client",
    },
    clients: {
      warning: "This will permanently delete all the clients.",
      confirm: "Yes, Delete Clients",
    },
    vendor: {
      warning: "This will permanently delete the vendor.",
      confirm: "Yes, Delete Vendor",
    },
    vendors: {
      warning: "This will permanently delete all the vendors.",
      confirm: "Yes, Delete Vendors",
    },
    user: {
      warning: "This will permanently delete the user.",
      confirm: "Yes, Delete User",
    },
  };

  // Determine which message type to use
  const getMessageType = () => {
    if (type === "expense" && expensePaymentStatus === "paid") {
      return "paid_expense";
    }
    return type;
  };

  const messageType = getMessageType();
  const message = messages[messageType];

  useEffect(() => {
    if (isLoading) return; // ⛔ pause countdown while deleting

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
    <div className="relative p-4 rounded-lg bg-white dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black border-gray-200 shadow-lg max-w-[300px]">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 mt-0.5">
          <Trash2 className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <p className="text-sm text-gray-800 dark:text-gray-300">
            {message.warning}{" "}
            <span className="font-semibold text-red-600">
              It cannot be undone.
            </span>
          </p>
          {/* Show additional note for paid expenses */}
          {messageType === "paid_expense" && message.note && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium">
              {message.note}
            </p>
          )}
        </div>
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
          className={`px-4 py-1.5 text-sm text-white rounded-lg transition
      flex items-center justify-center gap-2 min-w-[150px]
      ${
        isLoading
          ? "bg-red-400 cursor-not-allowed"
          : "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500"
      }
    `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Deleting…
            </>
          ) : (
            message.confirm
          )}
        </button>
      </div>
      {/* Countdown bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-200 w-full rounded-b-md overflow-hidden">
        <div
          className="h-full bg-orange-400 transition-all duration-100"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
