// src/components/TaskList.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function TaskList({ selectedEventId }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!selectedEventId) return;

    axios
      .get(`/tasks?eventId=${selectedEventId}`)
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, [selectedEventId]);

  const updateStatus = (taskId, newStatus) => {
    axios
      .patch(`/tasks/${taskId}`, { status: newStatus })
      .then((res) => {
        setTasks((prev) =>
          prev.map((task) => (task._id === taskId ? res.data : task))
        );
      })
      .catch((err) => console.error("Error updating status:", err));
  };

  if (!tasks.length) return <p>No tasks for this event.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Tasks</h2>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="border p-4 rounded-md shadow-sm bg-white"
          >
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p>{task.description}</p>
            <p>
              <strong>Assigned:</strong> {task.assignedTo || "Unassigned"}
            </p>
            <p>
              <strong>Priority:</strong> {task.priority} | <strong>Status:</strong>{" "}
              {task.status}
            </p>
            <p>
              <strong>Deadline:</strong>{" "}
              {task.deadline ? new Date(task.deadline).toLocaleDateString() : "None"}
            </p>
            <div className="space-x-2 mt-2">
              {task.status !== "In Progress" && (
                <button
                  onClick={() => updateStatus(task._id, "In Progress")}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Start
                </button>
              )}
              {task.status !== "Completed" && (
                <button
                  onClick={() => updateStatus(task._id, "Completed")}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Complete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
