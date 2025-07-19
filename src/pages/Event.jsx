import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../redux/tasksSlice";
import { fetchEvents } from "../redux/eventsSlice";

export default function Event() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const eventsState = useSelector((state) => state.events);
  const tasksState = useSelector((state) => state.tasks);

  useEffect(() => {
    if (eventsState.items.length === 0) dispatch(fetchEvents());
    dispatch(fetchTasks(id));
  }, [dispatch, id]);

  const event = eventsState.items.find((event) => event._id === id);

  if (eventsState.status === "loading") return <p>Loading event...</p>;
  if (eventsState.status === "failed")
    return <p>Error loading event: {eventsState.error}</p>;

  if (!event) return <p>Event not found.</p>;

  return (
    <main className="p-6 max-w-4xl mx-auto h-screen">
      <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
      <p className="mb-2 text-gray-700">{event.description}</p>
      <p className="mb-4 text-sm text-gray-500">
        {new Date(event.date).toLocaleDateString()}
      </p>

      <h2 className="text-xl font-semibold mb-2">Tasks</h2>
      {tasksState.status === "loading" && <p>Loading tasks...</p>}
      {tasksState.status === "failed" && (
        <p className="text-red-500">Error: {tasksState.error}</p>
      )}
      {tasksState.items.length === 0 && tasksState.status === "succeeded" && (
        <p>No tasks for this event.</p>
      )}

      <ul className="space-y-2">
        {tasksState.items.map((task) => (
          <li key={task._id} className="p-3 border rounded bg-white shadow-sm">
            <strong>{task.title}</strong>: {task.description}
          </li>
        ))}
      </ul>
    </main>
  );
}
