import { useEffect, useState } from "react";

export default function CustomToast({ message, t, duration = 4000 }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = 10; // ms
    const step = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => Math.max(prev - step, 0));
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg max-w-[300px]">
      <p className="text-sm text-gray-800 mb-2">{message}</p>
      <div className="w-full h-1 bg-gray-200 rounded">
        <div
          className="h-1 bg-orange-400 transition-all duration-100"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
