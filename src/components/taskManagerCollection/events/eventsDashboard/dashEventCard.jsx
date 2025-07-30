import { formatDateTime } from "../../utils/formatting";
import ProgressBar from "../../../ui/ProgressBar";

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
        <h3 className="font-medium text-gray-800">{event.name}</h3>
        <span className="text-xs bg-[#F59E0B] text-white px-2 py-1 rounded-full">
          {event.type}
        </span>
      </div>

      <div className="mt-2 text-xs text-gray-600 space-y-1">
        <div className="flex items-center">
          <span className="font-medium mr-1">Date:</span>
          {formatDateTime(event.date)}
        </div>
        <div className="flex items-center">
          <span className="font-medium mr-1">Location:</span>
          {event.location.city}, {event.location.country}
        </div>
      </div>

      {/* Enhanced Budget Display */}
     

      <div className="mt-3 flex justify-end">
        <span
          className={`px-2 py-1 rounded text-xs ${
            event.status === "Completed"
              ? "bg-green-100 text-green-800"
              : event.status === "Cancelled"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {event.status}
        </span>
      </div>
    </div>
  );
}
