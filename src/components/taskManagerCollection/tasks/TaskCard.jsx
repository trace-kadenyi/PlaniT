import { Pencil, Trash2 } from "lucide-react";

import { TasksPriorityPill, TaskStatusPill } from "../../shared/UIFragments";
import { formatDateTimeTasks } from "../utils/formatting";

export default function TaskCard({
  tasks,
  setTaskToEdit,
  setShowCreateTaskForm,
  handleTaskDelete,
  setScrollToForm,
}) {
  // Sort tasks by deadline (earliest first)
  const sortedTasks = [...tasks].sort((a, b) => {
    // Handle cases where deadline might be missing
    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1; // tasks without deadline go to the end
    if (!b.deadline) return -1; // tasks without deadline go to the end
    return new Date(a.deadline) - new Date(b.deadline);
  });
  return (
    <ul className="grid sm:grid-cols-2 gap-4">
      {sortedTasks.map((task) => (
        <li
          key={task._id}
          className="relative bg-[#FFF9F5] border border-[#F3EDE9] rounded-xl shadow-md p-4 space-y-2 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)]"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="mb-2 text-md font-semibold text-[#9B2C62] dark:text-[#F59E0B]/90">
                {task.title}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {task.description || "No description."}
              </p>
            </div>
            <div className="flex space-x-2">
              {/* Edit Button */}
              <button
                className="p-1.5 rounded-md transition-all duration-200 
              text-[#9B2C62] hover:text-white hover:bg-[#9B2C62]
              group relative dark:text-[#D97706] dark:hover:bg-[#D97706]"
                title="Edit Task"
                onClick={() => {
                  setTaskToEdit(task);
                  setShowCreateTaskForm(true);
                  if (typeof setScrollToForm === "function") {
                    setScrollToForm(true);
                  }
                }}
              >
                <Pencil className="w-4 h-4" />
                {/* Optional tooltip */}
                <span
                  className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                >
                  Edit Task
                </span>
              </button>

              {/* Delete Button */}
              <button
                className="p-1.5 rounded-md transition-all duration-200 
              text-[#BE3455] hover:text-white hover:bg-[#BE3455]
              group relative dark:text-[#D97706] dark:hover:bg-[#D97706]"
                title="Delete Task"
                onClick={() => handleTaskDelete(task._id)}
              >
                <Trash2 className="w-4 h-4" />
                {/* Optional tooltip */}
                <span
                  className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                >
                  Delete Task
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 text-xs text-gray-600 dark:text-gray-300 pt-2 gap-1">
            {/* priority */}
            <div>
              <span className="font-semibold text-gray-500 dark:text-gray-400">
                Priority:
              </span>{" "}
              <TasksPriorityPill priority={task.priority} />
            </div>

            {/* status */}
            <div>
              <span className="font-semibold text-gray-500 dark:text-gray-400">
                Status:
              </span>{" "}
              <TaskStatusPill status={task.status} />
            </div>

            {/* assigned to */}
            <div>
              <span className="font-semibold text-gray-500 dark:text-gray-400">
                Assigned To:
              </span>{" "}
              <span
                className="max-w-[120px] truncate inline-block align-bottom"
                title={
                  task.assignedTo
                    ? typeof task.assignedTo === "object"
                      ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}`
                      : "User ID: " + task.assignedTo
                    : "Unassigned"
                } // Show full name on hover
              >
                {task.assignedTo
                  ? typeof task.assignedTo === "object"
                    ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}`
                    : "User ID: " + task.assignedTo
                  : "Unassigned"}
              </span>
            </div>

            {/* deadline */}
            <div>
              <span className="font-semibold text-gray-500 dark:text-gray-400">
                Deadline:
              </span>{" "}
              {task.deadline
                ? new Date(task.deadline).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "—"}
            </div>
          </div>

          {/* created/updated dates */}
          <div className="text-[10px] text-gray-400 dark:text-gray-400/80 pt-2">
            <span> Created: {formatDateTimeTasks(task.createdAt)}</span>{" "}
            {task.createdBy && (
              <span>
                by {task.createdBy.firstName} {task.createdBy.lastName}
              </span>
            )}
            {task.updatedBy && (
              <div>
                <span>Updated: {formatDateTimeTasks(task.updatedAt)}</span>{" "}
                <span>
                  by {task.updatedBy.firstName} {task.updatedBy.lastName}
                </span>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
