// src/components/EventList.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents, setSelectedEventId } from "../../../features/events/eventsSlice";
import { fetchTasks, clearTasks } from "../../../features/tasks/tasksSlice";

export default function EventList() {
  const dispatch = useDispatch();
  const { items: events, status } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleEventClick = (eventId) => {
    dispatch(setSelectedEventId(eventId));
    dispatch(fetchTasks(eventId));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Events</h2>
      {status === "loading" && <p>Loading events...</p>}
      {status === "failed" && <p>Error loading events</p>}
      {status === "succeeded" && (
        <ul className="space-y-2">
          {events.map((event) => (
            <li
              key={event._id}
              className="cursor-pointer text-blue-600 hover:underline"
              onClick={() => handleEventClick(event._id)}
            >
              {event.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
