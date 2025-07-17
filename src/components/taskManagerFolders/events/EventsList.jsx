import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents, setSelectedEventId } from "../../../features/events/eventsSlice"

export default function EventsList() {
  const dispatch = useDispatch();
  const { items: events, selectedEventId, status } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleSelect = (id) => dispatch(setSelectedEventId(id));

  return (
    <div>
      <h2 className="text-xl font-bold">Events</h2>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : (
        events.map((event) => (
          <div key={event._id}>
            <button
              onClick={() => handleSelect(event._id)}
              className={`p-2 ${selectedEventId === event._id ? "bg-blue-200" : ""}`}
            >
              {event.title}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
