import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../../../features/tasks/tasksSlice"

export default function TasksList() {
  const dispatch = useDispatch();
  const { items: tasks, status } = useSelector((state) => state.tasks);
  const selectedEventId = useSelector((state) => state.events.selectedEventId);

  useEffect(() => {
    if (selectedEventId) {
      dispatch(fetchTasks(selectedEventId));
    }
  }, [dispatch, selectedEventId]);

  return (
    <div>
      <h2 className="text-xl font-bold">Tasks for Selected Event</h2>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : !tasks.length ? (
        <p>No tasks found for this event.</p>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="border p-2 my-2">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </div>
        ))
      )}
    </div>
  );
}
