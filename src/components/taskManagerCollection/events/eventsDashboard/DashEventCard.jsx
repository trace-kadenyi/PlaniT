import { Link } from "react-router-dom";

import { formatDateTime } from "../../utils/formatting";
import ProgressBar from "../../../ui/ProgressBar";
import { truncateText } from "../../utils/formatting";
import { EventStatusPill } from "../../../shared/UIFragments";
import { getUrgency, getUrgencyDisplay } from "../../utils/genDashboardHelpers";

export default function DashEventCard({ event }) {
  // handle urgent events
  const urgency = getUrgency(event.date, event.status); // uses default ["Completed", "Cancelled"]
  const urgencyDisplay = getUrgencyDisplay(urgency);

  // Safely access budget data
  const {
    totalBudget = 0,
    spentAmount = 0,
    reservedAmount = 0,
    remainingBudget = 0,
  } = event.budgetStatus || {};

  const usedBudget = spentAmount + reservedAmount;
  const hasBudget = totalBudget > 0;
  const percentageUsed = hasBudget ? (usedBudget / totalBudget) * 100 : 0;

  const isBudgetWarning = hasBudget && remainingBudget < totalBudget * 0.1;

  return (
    <div
      className={`relative z-20 ${event.status === "Cancelled" ? "opacity-70" : "opacity-100"}`}
      style={{ pointerEvents: "none" }}
    >
      {/* Urgency badge */}
      {urgencyDisplay && (
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-semibold mb-2 ${
            urgencyDisplay.color === "red"
              ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-500"
              : "bg-amber-100 text-[#9B2C62] dark:bg-amber-900/20 dark:text-amber-500"
          }`}
        >
          {urgencyDisplay.label}
        </span>
      )}

      <div className="flex justify-between items-start gap-1">
        {/* event name */}
        <Link
          to={`/events/${event.id}`}
          className="font-medium text-gray-800 dark:text-gray-200 mt-7 hover:underline"
          style={{ pointerEvents: "auto" }}
          onClick={(e) => e.stopPropagation()}
        >
          {truncateText(event.name, 26)}
        </Link>
        <span className="absolute right-0 text-xs bg-[#F59E0B] text-white dark:text-black px-2 py-1 rounded-full">
          {event.type}
        </span>
      </div>

      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
        {/* date */}
        <div className="flex items-center">
          <span className="relative flex mr-2 flex-shrink-0 w-2 h-2">
            {urgencyDisplay?.color === "red" && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full w-2 h-2 ${
                urgencyDisplay?.color === "red"
                  ? "bg-red-500"
                  : urgencyDisplay?.color === "amber"
                    ? "bg-[#9B2C62] dark:bg-[#F59E0B]"
                    : "bg-gray-500 dark:bg-gray-400"
              }`}
            />
          </span>
          <span
            className={`font-semibold ${
              urgencyDisplay?.color === "red"
                ? "text-red-600 dark:text-red-500"
                : urgencyDisplay?.color === "amber"
                  ? "text-[#9B2C62] dark:text-[#F59E0B]"
                  : ""
            }`}
          >
            {formatDateTime(event.date)}
          </span>
        </div>

        {/* location */}
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
              <span className="text-gray-700 dark:text-gray-400 font-medium">
                Budget:
              </span>
              <span className={`font-semibold dark:text-gray-300`}>
                ${usedBudget.toLocaleString()} / ${totalBudget.toLocaleString()}
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
                  isBudgetWarning
                    ? "text-[#9B2C62]"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {percentageUsed.toFixed(1)}% used
              </span>
              <span
                className={`font-semibold ${
                  isBudgetWarning
                    ? "text-[#9B2C62]"
                    : "text-gray-700 dark:text-gray-400"
                }`}
              >
                ${remainingBudget.toLocaleString()} remaining
              </span>
            </div>
          </>
        ) : (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            No budget set
          </div>
        )}
      </div>

      <div className="mt-3 flex justify-end">
        <EventStatusPill status={event.status} />
      </div>
    </div>
  );
}
