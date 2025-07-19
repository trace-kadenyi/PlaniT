import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents, deleteEvent } from "../../../redux/eventsSlice";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";

import { formatDateTime, getStatusColor } from "../utils/formatting";
import { toastWithProgress } from "../utils/toastWithProgress";
import DeleteEventToast from "../utils/deleteEventToast";

export default function Events() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: events, status, error } = useSelector((state) => state.events);

  // fetch events
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // handle delete event
  const handleDelete = (id) => {
    const duration = 10000; // 10 seconds

    toast(
      (t) => (
        <DeleteEventToast
          t={t}
          duration={duration}
          onConfirm={() => {
            dispatch(deleteEvent(id));
            toast.dismiss(t.id);
            toastWithProgress("Event deleted");
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
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700" onClick={() => navigate("/events/create")}>
        + Create Event
      </button>

      <h1 className="text-3xl font-bold text-[#9B2C62] mb-6">My Events</h1>

      {status === "loading" && (
        <p className="text-gray-600">Loading events...</p>
      )}
      {status === "failed" && <p className="text-red-500">Error: {error}</p>}
      {status === "succeeded" && events.length === 0 && (
        <p className="text-gray-600">No events found. Start by creating one!</p>
      )}

      {status === "succeeded" && events.length > 0 && (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <li
              key={event._id}
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
              <div className="absolute top-5 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => navigate(`/events/${event._id}/edit`)}
                  className="flex items-center space-x-1 text-sm px-1 py-1 rounded-full bg-[#F59E0B]/10 text-[#BE3455] hover:bg-[#F59E0B]/20 transition text-xs cursor-pointer"
                  title="Edit"
                >
                  <Pencil className="w-3 h-3" />
                  <span>edit</span>
                </button>

                <button
                  onClick={() => handleDelete(event._id)}
                  className="flex items-center space-x-1 text-sm px-2 py-1 rounded-full bg-red-100/30 text-red-600 hover:bg-red-200 transition text-xs cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>delete</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
