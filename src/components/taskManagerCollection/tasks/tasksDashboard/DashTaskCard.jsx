import { Link } from "react-router-dom";

import { truncateText } from "../../utils/formatting";
import { TasksPriorityPill } from "../../../shared/UIFragments";
import { getUrgency, getUrgencyDisplay } from "../../utils/genDashboardHelpers";

export default function DashTaskCard({ task }) {
  const urgency = getUrgency(task.due, task.status, ["Completed"]);
  const urgencyDisplay = getUrgencyDisplay(urgency);

  return (
    <div className="relative z-20" style={{ pointerEvents: "none" }}>
      {/* urgency badge */}
      {urgencyDisplay ? (
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
            urgencyDisplay.color === "red"
              ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-500"
              : "bg-amber-100 text-[#9B2C62] dark:bg-amber-900/20 dark:text-amber-500"
          }`}
        >
          {urgencyDisplay.label}
        </span>
      ) : (
        <span />
      )}

      {/* title and priority */}
      <div className="flex justify-between items-start mt-1">
        <h3 className="font-medium text-gray-800 dark:text-gray-200">
          {truncateText(task.title, 25)}
        </h3>
        {task.priority === "high" && (
          <span className="text-xs bg-[#F59E0B] dark:bg-[#D97706] text-white px-2 py-1 rounded-full">
            {task.priority}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center text-xs text-gray-600 dark:text-gray-400">
        {/* event name */}
        {task.eventId ? (
          <Link
            to={`/events/${task.eventId}`}
            className="bg-[#9B2C62] text-white px-2 py-1 rounded mr-2 hover:underline"
            style={{ pointerEvents: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            {truncateText(task.event, 45)}
          </Link>
        ) : (
          <span className="bg-[#9B2C62] text-white px-2 py-1 rounded mr-2">
            {truncateText(task.event, 25)}
          </span>
        )}

        {/* due date */}
        <div className="flex gap-1.5">
          <span className="relative flex-shrink-0 w-2 h-2">
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
            Due: {task.due}
          </span>
        </div>
      </div>

      {/* assignee */}
      <div className="mt-3 flex justify-between items-center text-xs">
        <span className="text-gray-500 dark:text-gray-400">
          {task.assignee
            ? `${task.assignee.firstName} ${task.assignee.lastName}`
            : "Unassigned"}
        </span>
        <TasksPriorityPill priority={task.priority} />
      </div>
    </div>
  );
}
