import { Link } from "react-router-dom";
import { formatDateTime } from "../../utils/formatting";

export default function DashEventCard({ event }) {
  return (
    <div className="relative z-20" style={{ pointerEvents: "none" }}>
      <div className="flex justify-between items-start">
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

      <div className="mt-3 flex justify-between items-center text-xs">
        <span className="text-gray-500">
          Budget: ${event.budgetStatus?.totalBudget || "N/A"}
        </span>
        <span
          className={`px-2 py-1 rounded ${
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