// src/components/TaskList.jsx
import { useSelector } from "react-redux";

export default function TaskList() {
  const { items: tasks, status } = useSelector((state) => state.tasks);
  const selectedEventId = useSelector((state) => state.events.selectedEventId);

  if (!selectedEventId) return <p className="p-4">Select an event to view tasks.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Tasks</h2>
      {status === "loading" && <p>Loading tasks...</p>}
      {status === "failed" && <p>Error loading tasks</p>}
      {status === "succeeded" && tasks.length === 0 && <p>No tasks for this event.</p>}
      {status === "succeeded" && tasks.length > 0 && (
        <ul className="list-disc ml-6">
          {tasks.map((task) => (
            <li key={task._id}>{task.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
