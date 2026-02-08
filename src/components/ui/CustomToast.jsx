import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CustomToast({ message, t, duration = 4000 }) {
  const [progress, setProgress] = useState(100);

  // ⏱ single progress timer
  useEffect(() => {
    const interval = 10;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => Math.max(prev - step, 0));
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

  // ✅ dismiss AFTER render
  useEffect(() => {
    if (progress === 0) {
      toast.dismiss(t.id);
    }
  }, [progress, t.id]);

  return (
    <div className="p-4 bg-white dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-w-[300px]">
      <p className="text-sm text-gray-800 dark:text-gray-300 mb-2">{message}</p>
      <div className="w-full h-1 bg-gray-200 rounded">
        <div
          className="h-1 bg-orange-400 transition-all duration-100"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
