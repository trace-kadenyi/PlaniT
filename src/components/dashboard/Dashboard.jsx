import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../redux/eventsSlice";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: events, status, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleEventClick = (id) => {
    navigate(`/events/${id}`);
  };

  return (
    <main className="p-6 h-screen">
      <h1 className="text-2xl font-bold mb-4">My Events</h1>

      {status === "loading" && <p>Loading events...</p>}
      {status === "failed" && <p className="text-red-500">Error: {error}</p>}

      {status === "succeeded" && events.length === 0 && (
        <p>No events found. Start by creating one!</p>
      )}

      {status === "succeeded" && events.length > 0 && (
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event._id}
              onClick={() => handleEventClick(event._id)}
              className="cursor-pointer p-4 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold">{event.name}</h2>
              <p className="text-sm text-gray-600">
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="mt-2 text-gray-700 line-clamp-2">
                {event.description || "No description provided."}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
