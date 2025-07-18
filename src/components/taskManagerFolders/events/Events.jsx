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
                className="block text-left w-full"
              >
                <h2 className="text-xl font-semibold text-[#BE3455]">
                  {event.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="mt-2 text-gray-700 line-clamp-2">
                  {event.description || "No description provided."}
                </p>
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
