import { Link } from "react-router-dom";

import { formatDateTime } from "../../utils/formatting";
import ProgressBar from "../../../ui/ProgressBar";
import { truncateText } from "../../utils/formatting";
import { StatusPill } from "../../../shared/UIFragments";

export default function DashEventCard({ event }) {
  // Safely access budget data
  const {
    totalBudget = 0,
    totalExpenses = 0,
    remainingBudget = 0,
  } = event.budgetStatus || {};

  const hasBudget = totalBudget > 0;
  const percentageUsed = hasBudget ? (totalExpenses / totalBudget) * 100 : 0;
  const isBudgetWarning = hasBudget && remainingBudget < totalBudget * 0.1;

  return (
    <div className="relative z-20" style={{ pointerEvents: "none" }}>
      <div className="flex justify-between items-start gap-1">
        <Link
          to={`/events/${event.id}`}
          className="font-medium text-gray-800 mt-7 hover:underline"
          style={{ pointerEvents: "auto" }}
          onClick={(e) => e.stopPropagation()}
        >
          {truncateText(event.name, 26)}
        </Link>
        <span className="absolute right-0 text-xs bg-[#F59E0B] text-white px-2 py-1 rounded-full">
          {event.type}
        </span>
      </div>

      <div className="mt-2 text-xs text-gray-600 space-y-1">
        <div className="flex items-center">
          <span className="font-medium mr-1">Date:</span>
          <span className="font-semibold">{formatDateTime(event.date)}</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium mr-1">Location:</span>
          {event.location.city}, {event.location.country}
        </div>
      </div>

      {/* Enhanced Budget Display */}
      <div className="mt-3 space-y-2">
        {hasBudget ? (
          <>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-700 font-medium">Budget:</span>
              <span className="font-medium">
                ${totalExpenses.toLocaleString()} / $
                {totalBudget.toLocaleString()}
              </span>
            </div>
            <ProgressBar
              value={percentageUsed}
              className={isBudgetWarning ? "bg-red-100" : "bg-[#FFF5EB]"}
              height="h-2"
            />
            <div className="flex justify-between text-xs">
              <span
                className={`${
                  isBudgetWarning ? "text-[#9B2C62]" : "text-gray-600"
                }`}
              >
                {percentageUsed.toFixed(1)}% used
              </span>
              <span
                className={`font-semibold ${
                  isBudgetWarning ? "text-[#9B2C62]" : "text-gray-700"
                }`}
              >
                ${remainingBudget.toLocaleString()} remaining
              </span>
            </div>
          </>
        ) : (
          <div className="text-xs text-gray-500">No budget set</div>
        )}
      </div>

      <div className="mt-3 flex justify-end">
        <StatusPill status={event.status} />
      </div>
    </div>
  );
}
