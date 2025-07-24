import { Pencil, Trash2 } from "lucide-react";

export default function TaskCard({
  tasks,
  setTaskToEdit,
  setShowCreateTaskForm,
  handleTaskDelete,
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
          className="relative bg-[#FFF9F5] border border-[#F3EDE9] rounded-xl shadow-md p-4 space-y-2"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="mb-2 text-md font-semibold text-[#9B2C62]">
                {task.title}
              </h3>
              <p className="text-sm text-gray-700">
                {task.description || "No description."}
              </p>
            </div>
            <div className="flex space-x-2">
              {/* Edit Button */}
              <button
                className="p-1.5 rounded-md transition-all duration-200 
              text-[#9B2C62] hover:text-white hover:bg-[#9B2C62]
              group relative"
                title="Edit Task"
                onClick={() => {
                  setTaskToEdit(task);
                  setShowCreateTaskForm(true);
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
              group relative"
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

          <div className="grid grid-cols-2 text-xs text-gray-600 pt-2 gap-1">
            <div>
              <span className="font-semibold text-gray-500">Priority:</span>{" "}
              <span
                className={`inline-block px-2 py-0.5 rounded-full font-medium ${
                  task.priority === "High"
                    ? "bg-[#F59E0B]/20 text-[#C2410C]"
                    : task.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {task.priority}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-500">Status:</span>{" "}
              <span
                className={`inline-block px-2 py-0.5 rounded-full font-medium ${
                  task.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : task.status === "In Review"
                    ? "bg-purple-100 text-purple-700"
                    : task.status === "In Progress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {task.status}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-500">Assigned To:</span>{" "}
              <span
                className="max-w-[120px] truncate inline-block align-bottom"
                title={task.assignedTo || "Unassigned"} // Show full name on hover
              >
                {task.assignedTo || "Unassigned"}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-500">Deadline:</span>{" "}
              {task.deadline
                ? new Date(task.deadline).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "—"}
            </div>
          </div>

          <div className="text-[10px] text-gray-400 pt-2">
            Created: {new Date(task.createdAt).toLocaleString()}
            <br />
            Updated: {new Date(task.updatedAt).toLocaleString()}
          </div>
        </li>
      ))}
    </ul>
  );
}
