// src/components/TestEvents.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../features/events/eventsSlice";

export default function TestEvents() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  if (status === "loading") return <p>Loading events...</p>;
  if (status === "failed") return <p>Error loading events: {error}</p>;

  return (
    <div>
      <h2>Events</h2>
      {items.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {items.map((event) => (
            <li key={event._id}>{event.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
