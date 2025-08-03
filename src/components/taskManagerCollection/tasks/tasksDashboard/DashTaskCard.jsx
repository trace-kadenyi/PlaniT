import { Link } from "react-router-dom";

import { truncateText } from "../../utils/formatting";
import { TasksPriorityPill } from "../../../shared/UIFragments";

export default function DashTaskCard({ task }) {
  return (
    <div className="relative z-20" style={{ pointerEvents: "none" }}>
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-800">
          {truncateText(task.title, 25)}
        </h3>
        {task.priority === "high" && (
          <span className="text-xs bg-[#F59E0B] text-white px-2 py-1 rounded-full">
            {task.priority}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center text-xs text-gray-600">
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
        <span>Due: {task.due}</span>
      </div>

      <div className="mt-3 flex justify-between items-center text-xs">
        <span className="text-gray-500">{task.assignee || "Unassigned"}</span>
        <TasksPriorityPill priority={task.priority} />
      </div>
    </div>
  );
}
