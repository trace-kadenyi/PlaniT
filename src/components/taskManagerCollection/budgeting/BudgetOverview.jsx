import ProgressBar from "../../ui/ProgressBar";
import { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

export default function BudgetOverview({ budgetStatus }) {
  const [isPulsing, setIsPulsing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!budgetStatus || budgetStatus.totalBudget === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#F3EDE9] mb-6">
        <h2 className="text-lg font-semibold text-[#9B2C62] mb-4">
          Budget Overview
        </h2>
        <p className="text-gray-600">No budget set for this event</p>
      </div>
    );
  }

  const { totalBudget, totalExpenses, remainingBudget } = budgetStatus;
  const percentageUsed = (totalExpenses / totalBudget) * 100;
  const isBudgetWarning = remainingBudget < totalBudget * 0.1;

  useEffect(() => {
    if (isBudgetWarning) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isBudgetWarning]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#F3EDE9] mb-6">
      {/* Mobile Header with Toggle */}
      <button
        className="w-full sm:hidden"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#9B2C62] mb-2">
            Budget Overview
          </h2>
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5 text-[#6B3B0F]" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-[#6B3B0F]" />
          )}
        </div>
        <div className="flex justify-between text-sm font-medium mb-2">
          <span className="text-[#6B3B0F]">Budget Utilization</span>
          <span className="text-[#9B2C62] font-bold">
            {percentageUsed.toFixed(1)}%
          </span>
        </div>
        <ProgressBar
          value={percentageUsed}
          className={isBudgetWarning ? "bg-[#FFF5EB]" : "bg-[#FFF5EB]"}
        />
      </button>

      {/* Desktop Header (always visible) */}
      <div className="hidden sm:block space-y-4">
        <h2 className="text-lg font-semibold text-[#9B2C62]">
          Budget Overview
        </h2>
        <div className="flex justify-between text-sm font-medium mb-2">
          <span className="text-[#6B3B0F]">Budget Utilization</span>
          <span className="text-[#9B2C62] font-bold">
            {percentageUsed.toFixed(1)}%
          </span>
        </div>
        <ProgressBar
          value={percentageUsed}
          className={isBudgetWarning ? "bg-[#FFF5EB]" : "bg-[#FFF5EB]"}
        />
      </div>

      {/* Content Section (toggleable on mobile, always visible on desktop) */}
      <div className={isExpanded ? "block" : "hidden sm:block"}>
        {/* Budget Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mt-4">
          <div className="bg-[#FFF5EB] p-3 rounded-lg border border-[#F3EDE9]">
            <p className="text-sm text-[#6B3B0F] font-medium">Total Budget</p>
            <p className="text-xl font-bold text-[#9B2C62]">
              ${totalBudget.toLocaleString()}
            </p>
          </div>
          <div className="bg-[#FFF5EB] p-3 rounded-lg border border-[#F3EDE9]">
            <p className="text-sm text-[#6B3B0F] font-medium">Expenses</p>
            <p className="text-xl font-bold text-[#9B2C62]">
              ${totalExpenses.toLocaleString()}
            </p>
          </div>
          <div className="relative">
            <div
              className={`p-3 rounded-lg border ${
                isBudgetWarning
                  ? `bg-red-100 border-[#9B2C62]`
                  : "bg-[#FFF5EB] border-[#F3EDE9]"
              }`}
            >
              <p className="text-sm font-medium text-[#6B3B0F]">Remaining</p>
              <p className="text-xl font-bold text-[#9B2C62]">
                ${remainingBudget.toLocaleString()}
              </p>
            </div>
            {isBudgetWarning && (
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-[#9B2C62] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#9B2C62]"></span>
              </div>
            )}
          </div>
        </div>

        {/* Budget Warning (if applicable) */}
        {isBudgetWarning && (
          <div className="mt-4 p-3 bg-[#FFF5EB] rounded-lg text-[#6B3B0F] text-sm border border-[#9B2C62] flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-[#9B2C62] animate-bounce"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>Warning: Less than 10% of budget remaining</span>
          </div>
        )}
      </div>
    </div>
  );
}
