import { AlertTriangle, RotateCcw } from "lucide-react";

/* ===============================
   Full Page Dashboard Error
================================ */
export function DashboardPageError({ onRetry }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7ED] dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center border border-[#9B2C62] dark:border-[#F59E0B]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard failed to load
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We couldn’t load your dashboard data right now. This may be a
          temporary issue.
        </p>

        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-800 text-white rounded-lg hover:bg-red-700 transition font-semibold"
        >
          <RotateCcw className="w-4 h-4" />
          Retry Dashboard
        </button>
      </div>
    </div>
  );
}
