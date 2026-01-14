import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import ProgressBar from "../../ui/ProgressBar";
import { NoBudget } from "../../shared/Snippets";

export default function BudgetOverview({
  budgetStatus,
  deletedPaidTotal = 0,
  Link,
  eventID,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // No budget
  if (!budgetStatus || budgetStatus.totalBudget === 0) {
    return <NoBudget Link={Link} eventID={eventID} />;
  }

  const { totalBudget, totalExpenses, remainingBudget } = budgetStatus;
  const percentageUsed =
    totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;
  const isBudgetWarning = remainingBudget < totalBudget * 0.1;

  const renderHeader = (withChevron = false) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-0">
        <h2 className="text-lg font-semibold text-[#9B2C62] dark:text-[#D97706]">
          Budget Overview
        </h2>
        {withChevron && (
          <div className="pl-4">
            {isExpanded ? (
              <ChevronUpIcon className="h-5 w-5 text-[#6B3B0F]" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-[#6B3B0F]" />
            )}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-300 mb-4">
        Add expenses below to track budget utilization
      </p>
      <div className="flex justify-between text-sm font-medium">
        <span className="text-[#6B3B0F] dark:text-[#D97706]/90">
          Budget Utilization
        </span>
        <span className="text-[#9B2C62] dark:text-[#D97706] font-bold">
          {percentageUsed.toFixed(1)}%
        </span>
      </div>
      <ProgressBar
        value={percentageUsed}
        className={isBudgetWarning ? "bg-[#FFF5EB]" : "bg-[#FFF5EB]"}
      />
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#F3EDE9] dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 dark:border-gray-900 my-6">
      {/* Mobile Header with Toggle */}
      <button
        className="w-full sm:hidden text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {renderHeader(true)}
      </button>

      {/* Desktop Header */}
      <div className="hidden sm:block">{renderHeader()}</div>

      {/* Content Section */}
      <div className={isExpanded ? "block" : "hidden sm:block"}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mt-4">
          <div className="bg-[#FFF5EB] p-3 rounded-lg border border-[#F3EDE9] dark:bg-gray-800 dark:border-gray-800">
            <p className="text-sm text-[#6B3B0F] dark:text-gray-300 font-medium">
              Total Budget
            </p>
            <p className="text-xl font-bold text-[#9B2C62] dark:text-[#D97706]">
              ${totalBudget.toLocaleString()}
            </p>
          </div>
          <div className="bg-[#FFF5EB] dark:bg-gray-800 dark:border-gray-800 p-3 rounded-lg border border-[#F3EDE9]">
            <p className="text-sm text-[#6B3B0F] dark:text-gray-300 font-medium">
              Expenses
            </p>
            <p className="text-xl font-bold text-[#9B2C62] dark:text-[#D97706]">
              ${totalExpenses.toLocaleString()}
            </p>
          </div>

          <div className="relative">
            <div
              className={`p-3 rounded-lg border ${
                isBudgetWarning
                  ? `bg-red-100 dark:bg-[#9B2C62]/20 border-[#9B2C62] dark:border-[#9B2C62]/10`
                  : "bg-[#FFF5EB] border-[#F3EDE9] dark:bg-gray-800 dark:border-gray-800"
              }`}
            >
              <p className="text-sm font-medium text-[#6B3B0F] dark:text-gray-300">
                Remaining
              </p>
              <p className="text-xl font-bold text-[#9B2C62] dark:text-[#D97706]">
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

        {budgetStatus.deletedPaidTotal > 0 && (
          <p className="mt-2 text-xs text-gray-500 italic">
            Note: ${budgetStatus.deletedPaidTotal.toLocaleString()} in paid
            expenses were deleted. Paid expenses do not restore remaining
            budget.
          </p>
        )}

        {isBudgetWarning && (
          <div className="mt-4 p-3 bg-[#FFF5EB] rounded-lg text-[#6B3B0F] text-sm border border-[#9B2C62] flex items-center dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black dark:text-[#F59E0B] dark:border-[#F59E0B]/30">
            <svg
              className="w-5 h-5 mr-2 text-[#9B2C62] dark:text-[#F59E0B] animate-bounce"
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
