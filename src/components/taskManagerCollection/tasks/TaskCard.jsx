import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { TasksPriorityPill, TaskStatusPill } from "../../shared/UIFragments";
import { formatDateTimeShort, formatDateOnly } from "../utils/formatting";
import { CreatedUpdatedData } from "../../shared/Snippets";
import { DeleteTaskBtn, EditTaskBtn } from "../../buttons/TaskButtons";

export default function TaskCard({
  tasks,
  setTaskToEdit,
  setShowCreateTaskForm,
  handleTaskDelete,
  setScrollToForm,
}) {
  const navigate = useNavigate();
  const [isDeletePending, setIsDeletePending] = useState(false);

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
      {sortedTasks.map((task) => {
        const assignedUserName = task.assignedTo
          ? typeof task.assignedTo === "object"
            ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}`
            : "User ID: " + task.assignedTo
          : null;

        const assignedUserId = task.assignedTo
          ? typeof task.assignedTo === "object"
            ? task.assignedTo._id
            : task.assignedTo
          : null;
        return (
          <li
            id={task._id}
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
                <EditTaskBtn
                  setTaskToEdit={setTaskToEdit}
                  setShowCreateTaskForm={setShowCreateTaskForm}
                  setScrollToForm={setScrollToForm}
                  task={task}
                />

                {/* Delete Button */}
                <DeleteTaskBtn
                  handleTaskDelete={handleTaskDelete}
                  task={task}
                  isDeletePending={isDeletePending}
                  setIsDeletePending={setIsDeletePending}
                />
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
                {assignedUserName ? (
                  <button
                    onClick={() => navigate(`/users/${assignedUserId}`)}
                    className="max-w-[120px] truncate inline-block align-bottom text-[#9B2C62] dark:text-[#F59E0B] hover:text-[#801f4f] dark:hover:text-[#F59E0B] hover:underline transition-colors cursor-pointer"
                    title={`View ${assignedUserName}'s profile`}
                  >
                    {assignedUserName}
                  </button>
                ) : (
                  <span className="max-w-[120px] truncate inline-block align-bottom text-gray-500 dark:text-gray-400">
                    Unassigned
                  </span>
                )}
              </div>
              {/* deadline */}
              <div>
                <span className="font-semibold text-gray-500 dark:text-gray-400">
                  Deadline:
                </span>{" "}
                {task.deadline ? formatDateOnly(task.deadline) : "—"}
              </div>
            </div>

            {/* created/updated dates */}
            <CreatedUpdatedData
              item={task}
              formatDateTimeShort={formatDateTimeShort}
            />
          </li>
        );
      })}
    </ul>
  );
}
