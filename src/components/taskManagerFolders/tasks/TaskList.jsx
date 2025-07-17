import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTask } from "../../../features/tasksSlice";

export default function TasksViewer({ selectedEventId }) {
  const dispatch = useDispatch();
  const { items: tasks, status, error } = useSelector((state) => state.tasks);

  // fetch tasks
  useEffect(() => {
    if (selectedEventId) {
      dispatch(fetchTasks(selectedEventId));
    }
  }, [selectedEventId, dispatch]);

  // handle delete
  const handleDelete = (taskId) => {
    dispatch(deleteTask(taskId));
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-3">Tasks for Event</h2>

      {status === "loading" && <p>Loading tasks...</p>}
      {status === "failed" && <p className="text-red-500">Error: {error}</p>}
      {status === "succeeded" && tasks.length === 0 && (
        <p>No tasks for this event yet.</p>
      )}

      {status === "succeeded" && tasks.length > 0 && (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded"
            >
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-gray-500">{task.description}</p>
              </div>
              <button
                onClick={() => handleDelete(task._id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
