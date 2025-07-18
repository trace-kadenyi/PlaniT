import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents, deleteEvent } from "../../../redux/eventsSlice";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";

export default function Events() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: events, status, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      dispatch(deleteEvent(id));
    }
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <main className="p-6 min-h-screen bg-white">
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
              className="relative p-5 border border-gray-200 rounded-2xl shadow-sm bg-[#FFF8F2] hover:shadow-md transition group"
            >
              <button
                onClick={() => navigate(`/events/${event._id}`)}
                className="block text-left w-full space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[#BE3455]">
                    {event.name}
                  </h2>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#F59E0B]/20 text-[#F59E0B]">
                    {event.type}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  {formatDateTime(event.date)}
                </p>

                <p className="text-sm text-gray-700 line-clamp-2">
                  {event.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-500">
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

              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => navigate(`/events/${event._id}/edit`)}
                  className="p-1 rounded-full hover:bg-[#F59E0B]/20"
                  title="Edit"
                >
                  <Pencil className="h-5 w-5 text-[#F59E0B]" />
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="p-1 rounded-full hover:bg-red-100"
                  title="Delete"
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
