import { useState, useEffect } from "react";

export default function DeleteEventToast({ t, duration, onConfirm, onCancel }) {
  const [progress, setProgress] = useState(100);

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
      <p className="text-sm text-gray-800 mb-4">
        This action will permanently{" "}
        <span className="font-semibold text-red-600">delete</span> the event and
        all associated tasks. It cannot be undone.
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onConfirm}
          className="px-4 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition cursor-pointer"
        >
          Yes, Delete
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-green-600 hover:text-white transition cursor-pointer"
        >
          Cancel
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
