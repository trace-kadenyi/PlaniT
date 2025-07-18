import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../../redux/eventsSlice";
import { fetchTasks, clearTasks } from "../../../redux/tasksSlice";

export default function EventList() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.events);
  const tasksState = useSelector((state) => state.tasks);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // fetch events
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // handle event click
  const handleEventClick = (eventId) => {
    if (eventId === selectedEventId) {
      setSelectedEventId(null);
      dispatch(clearTasks());
    } else {
      setSelectedEventId(eventId);
      dispatch(fetchTasks(eventId));
    }
  };

  // handle status
  if (status === "loading") return <p>Loading events...</p>;
  if (status === "failed") return <p>Error loading events: {error}</p>;

  return (
    <div>
      <h2>All Events</h2>
      {items.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {items.map((event) => (
            <li
              key={event._id}
              onClick={() => handleEventClick(event._id)}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                cursor: "pointer",
                backgroundColor:
                  selectedEventId === event._id ? "#f0f8ff" : "#fff",
              }}
            >
              <h3>{event.name}</h3>
              <p>{event.description}</p>
              <p>{new Date(event.date).toLocaleDateString()}</p>

              {/* Show tasks if this event is selected */}
              {/* {selectedEventId === event._id && (
                <div>
                  <h4>Tasks</h4>
                  {tasksState.status === "loading" && <p>Loading tasks...</p>}
                  {tasksState.status === "failed" && (
                    <p>Error: {tasksState.error}</p>
                  )}
                  {tasksState.items.length === 0 &&
                    tasksState.status === "succeeded" && (
                      <p>No tasks for this event.</p>
                    )}
                  <ul>
                    {tasksState.items.map((task) => (
                      <li key={task._id}>
                        <strong>{task.title}</strong>: {task.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
