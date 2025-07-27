import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteConfirmationToast({
  t,
  duration,
  onConfirm,
  onCancel,
  type = "event", // 'event' or 'task'
}) {
  const [progress, setProgress] = useState(100);
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
  };

  useEffect(() => {
    const interval = 10;
    const step = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => Math.max(prev - step, 0));
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

  return (
    <div className="relative p-4 rounded-lg bg-white border border-gray-200 shadow-lg max-w-[300px]">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 mt-0.5">
          <Trash2
            className={`w-5 h-5 ${
              type === "event" ? "text-red-600" : "text-[#BE3455]"
            }`}
          />
        </div>
        <p className="text-sm text-gray-800">
          {messages[type].warning}{" "}
          <span className="font-semibold text-red-600">
            It cannot be undone.
          </span>
        </p>
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`px-4 py-1.5 text-sm text-white rounded-lg transition cursor-pointer ${
            type === "event"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-[#BE3455] hover:bg-[#9B2C62]"
          }`}
        >
          {messages[type].confirm}
        </button>
      </div>
      {/* Countdown bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-200 w-full rounded-b-md overflow-hidden">
        <div
          className={`h-full transition-all duration-100 ${
            type === "event" ? "bg-orange-400" : "bg-[#F59E0B]"
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
