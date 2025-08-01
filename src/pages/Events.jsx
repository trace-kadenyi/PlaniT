import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { fetchEvents, deleteEvent } from "../redux/eventsSlice";
import {
  formatDateTime,
  getStatusColor,
} from "../components/taskManagerCollection/utils/formatting";
import { toastWithProgress } from "../globalHooks/useToastWithProgress";
import DeleteConfirmationToast from "../components/taskManagerCollection/utils/deleteConfirmationToast";
import EditDeleteEvent from "../components/shared/EditDeleteEvent";

export default function Events() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: events, status, error } = useSelector((state) => state.events);

  // fetch events
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Sort events by date in ascending order (earliest first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // handle delete event
  const handleDelete = (id) => {
    const duration = 10000; // 10 seconds

    toast(
      (t) => (
        <DeleteConfirmationToast
          t={t}
          duration={duration}
          onConfirm={() => {
            dispatch(deleteEvent(id));
            toast.dismiss(t.id);
            toastWithProgress("Event deleted successfully");
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
    <main className="p-6 min-h-screen bg-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#9B2C62]">Events Manager</h1>
        <button
          onClick={() => navigate("/events/new")}
          className="flex items-center gap-2 bg-[#9B2C62] text-white px-4 py-2 rounded-lg shadow hover:bg-[#801f4f] transition"
        >
          + Create New Event
        </button>
      </div>
      {status === "loading" && (
        <p className="text-gray-600">Loading events...</p>
      )}
      {status === "failed" && <p className="text-red-500">Error: {error}</p>}
      {status === "succeeded" && events.length === 0 && (
        <p className="text-gray-600">No events found. Start by creating one!</p>
      )}

      {status === "succeeded" && events.length > 0 && (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map((event, index) => (
            <li
              key={index}
              className="relative p-6 rounded-xl bg-[#FFF8F2] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#F3EDE9] border-l-4 border-l-[#F59E0B] hover:shadow-[0_6px_25px_rgba(0,0,0,0.08)] hover:scale-[1.01] hover:-translate-y-1 transition-all group"
            >
              <button
                onClick={() => navigate(`/events/${event._id}`)}
                className="block text-left w-full space-y-2"
              >
                <p className="inline-block text-[11px] px-2 py-0.5 rounded-md bg-gradient-to-r from-[#F8D476] to-[#F59E0B]/70 text-[#6B3B0F] font-medium tracking-wide">
                  {event.type}
                </p>
                <h2
                  className="mt-4 text-lg font-semibold text-[#9B2C62] tracking-tight line-clamp-1 hover:underline cursor-pointer"
                  onClick={() => navigate(`/events/${event._id}/edit`)}
                >
                  {event.name}
                </h2>

                <p className="text-xs text-gray-500 font-semibold">
                  {formatDateTime(event.date)}
                </p>

                <p className="text-sm text-gray-700 line-clamp-2">
                  {event.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500 font-medium">
                    {event.location?.city}, {event.location?.country}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                      event.status
                    )}`}
                  >
                    {event.status}
                  </span>
                </div>
              </button>
              {/* delete/edit buttons */}
              <EditDeleteEvent
                navigate={navigate}
                eventID={event._id}
                handleDelete={handleDelete}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
