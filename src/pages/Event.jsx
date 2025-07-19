import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../redux/tasksSlice";
import { fetchEvents, deleteEvent } from "../redux/eventsSlice";
import { Pencil, Trash2, Plus } from "lucide-react";

import {
  formatDateTime,
  getStatusColor,
} from "../components/taskManagerFolders/utils/formatting";
import toast from "react-hot-toast";
import { toastWithProgress } from "../components/taskManagerFolders/utils/toastWithProgress";
import DeleteEventToast from "../components/taskManagerFolders/utils/deleteEventToast";

export default function Event() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const eventsState = useSelector((state) => state.events);
  const tasksState = useSelector((state) => state.tasks);

  // fetch tasks
  useEffect(() => {
    if (eventsState.items.length === 0) dispatch(fetchEvents());
    dispatch(fetchTasks(id));
  }, [dispatch, id]);

  const event = eventsState.items.find((event) => event._id === id);

  // handle loading state
  if (eventsState.status === "loading") return <p>Loading event...</p>;
  // handle failed state
  if (eventsState.status === "failed")
    return <p>Error loading event: {eventsState.error}</p>;
  if (!event) return <p>Event not found.</p>;

  // handle delete
  const handleDelete = () => {
    const duration = 10000;
    toast(
      (t) => (
        <DeleteEventToast
          t={t}
          duration={duration}
          onConfirm={() => {
            dispatch(deleteEvent(id));
            toast.dismiss(t.id);
            toastWithProgress("Event deleted");
            navigate("/events");
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      {
        duration,
        position: "top-center",
      }
    );
  };

  return (
    <main className="p-6 min-h-screen bg-white max-w-4xl mx-auto">
      <div className="relative p-6 rounded-xl bg-[#FFF8F2] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#F3EDE9] border-l-4 border-l-[#F59E0B] mb-8">
        {/* Edit/Delete buttons */}
        <div className="absolute top-5 right-4 flex space-x-2">
          <button
            onClick={() => navigate(`/events/${event._id}/edit`)}
            className="flex items-center space-x-1 text-sm px-2 py-1 rounded-full bg-[#F59E0B]/10 text-[#BE3455] hover:bg-[#F59E0B]/20 transition text-xs cursor-pointer"
            title="Edit"
          >
            <Pencil className="w-3 h-3" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center space-x-1 text-sm px-2 py-1 rounded-full bg-red-100/30 text-red-600 hover:bg-red-200 transition text-xs cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
            <span>Delete</span>
          </button>
        </div>

        <div className="space-y-2">
          <p className="inline-block text-[11px] px-2 py-0.5 rounded-md bg-gradient-to-r from-[#F8D476] to-[#F59E0B]/70 text-[#6B3B0F] font-medium tracking-wide">
            {event.type}
          </p>

          <h1 className="text-2xl font-bold text-[#9B2C62]">{event.name}</h1>

          <p className="text-sm text-gray-600 font-medium">
            {formatDateTime(event.date)}
          </p>

          <p className="text-sm text-gray-700">{event.description}</p>

          <div className="grid sm:grid-cols-2 gap-2 pt-4 text-sm text-gray-600">
            <div>
              <span className="font-semibold text-gray-500">Venue:</span>{" "}
              {event.location.venue}
            </div>
            <div>
              <span className="font-semibold text-gray-500">Address:</span>{" "}
              {event.location.address}
            </div>
            <div>
              <span className="font-semibold text-gray-500">City:</span>{" "}
              {event.location.city}
            </div>
            <div>
              <span className="font-semibold text-gray-500">Country:</span>{" "}
              {event.location.country}
            </div>
            <div>
              <span className="font-semibold text-gray-500">Status:</span>{" "}
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                  event.status
                )}`}
              >
                {event.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#9B2C62]">Tasks</h2>
        <button
          onClick={() => {
            /* future create task modal */
          }}
          className="flex items-center space-x-1 text-sm px-3 py-1.5 rounded-full bg-[#BE3455]/10 text-[#BE3455] hover:bg-[#BE3455]/20 transition text-xs cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          <span>Create Task</span>
        </button>
      </div>

      {tasksState.status === "loading" && <p>Loading tasks...</p>}
      {tasksState.status === "failed" && (
        <p className="text-red-500">Error: {tasksState.error}</p>
      )}
      {tasksState.items.length === 0 && tasksState.status === "succeeded" && (
        <p className="text-gray-600">No tasks for this event.</p>
      )}

      <ul className="space-y-3">
        {tasksState.items.map((task) => (
          <li
            key={task._id}
            className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm"
          >
            <h3 className="font-semibold text-gray-800">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
