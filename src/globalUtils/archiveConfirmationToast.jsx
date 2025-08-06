import { useState, useEffect } from "react";
import { Archive, RefreshCcw } from "lucide-react";

export default function ArchiveConfirmationToast({
  t,
  duration,
  onConfirm,
  onCancel,
  isArchived = false,
}) {
  const [progress, setProgress] = useState(100);
  const action = isArchived ? "restore" : "archive";

  const messages = {
    archive: {
      warning: "This will archive the vendor. Archived vendors won't appear in regular listings.",
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
          {messages[action].icon}
        </div>
        <p className="text-sm text-gray-800">
          {messages[action].warning}
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
            action === "archive" 
              ? "bg-[#9B2C62] hover:bg-[#801f4f]" 
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {messages[action].confirm}
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