import { useState, useEffect } from "react";
import { Building2, CheckCircle, Loader2, X } from "lucide-react";

export default function OrgNameUpdateConfirmationToast({
  t,
  duration,
  onConfirm,
  onCancel,
  newName,
  oldName,
}) {
  const [progress, setProgress] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

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
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      // Toast dismissed externally
    }
  };

  const handleCancel = () => {
    if (isLoading) return;
    setIsClosing(true);
    setTimeout(() => onCancel(), 200);
  };

  return (
    <div
      className={`relative p-4 rounded-xl bg-white dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black border border-gray-200 dark:border-gray-700 shadow-lg max-w-[320px] transition-all duration-300 ${
        isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
      }`}
    >
      {/* Close button */}
      <button
        onClick={handleCancel}
        disabled={isLoading}
        className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-all duration-200 hover:rotate-90 disabled:cursor-not-allowed"
      >
        <X className="w-3 h-3" />
      </button>

      <div className="flex items-start gap-3 mb-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9B2C62] to-[#F59E0B] flex items-center justify-center shadow-md">
            <Building2 className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
            Rename Organization
          </h3>

          {/* Name change preview */}
          <div className="space-y-2 mb-3">
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                From
              </p>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 line-through truncate">
                {oldName}
              </p>
            </div>
            <div className="p-2 bg-[#F59E0B]/5 dark:bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/20 dark:border-[#F59E0B]/30">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                To
              </p>
              <p className="text-xs font-bold text-[#9B2C62] dark:text-[#F59E0B] truncate">
                {newName}
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            This will update the organization name across the platform.
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-all duration-200 ${
            isLoading
              ? "border-gray-200 text-gray-400 cursor-not-allowed dark:border-gray-700 dark:bg-gray-700"
              : "border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-900"
          }`}
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className={`px-3 py-1.5 text-xs font-bold text-white rounded-lg transition-all duration-200 flex items-center gap-2 min-w-[120px] justify-center ${
            isLoading
              ? "bg-[#9B2C62]/60 cursor-not-allowed"
              : "bg-gradient-to-r from-[#9B2C62] to-[#801f4f] hover:opacity-90"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <CheckCircle className="w-3 h-3" />
              Confirm Rename
            </>
          )}
        </button>
      </div>

      {/* Countdown bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-200 dark:bg-gray-700 w-full rounded-b-xl overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#F59E0B] to-[#9B2C62] transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
