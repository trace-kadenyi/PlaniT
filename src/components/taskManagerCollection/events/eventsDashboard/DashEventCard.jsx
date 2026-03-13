import { Link } from "react-router-dom";

import { formatDateTime } from "../../utils/formatting";
import ProgressBar from "../../../ui/ProgressBar";
import { truncateText } from "../../utils/formatting";
import { EventStatusPill } from "../../../shared/UIFragments";

export default function DashEventCard({ event }) {

  // get event urgency
const getUrgency = (date, status) => {
  if (status === "Completed" || status === "Cancelled") return null;

  const normalize = (d) => {
    const n = new Date(d);
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  };

  const eventDate = normalize(date);
  const now = normalize(new Date());

  if (eventDate < now) return "overdue";

  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + (6 - now.getDay()));
  if (eventDate <= endOfWeek) return "thisWeek";

  return null;
};

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
      <div className="flex justify-between items-start gap-1">
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
