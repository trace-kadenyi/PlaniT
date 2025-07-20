import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, Trash2, Plus, XCircle } from "lucide-react";

import {
  fetchTasks,
  clearTasks,
  deleteTask,
  updateTask,
} from "../redux/tasksSlice";
import { fetchEvents, deleteEvent } from "../redux/eventsSlice";
import CreateTaskForm from "../components/taskManagerFolders/tasks/CreateTaskForm";

import {
  formatDateTime,
  getStatusColor,
} from "../components/taskManagerFolders/utils/formatting";
import toast from "react-hot-toast";
import { toastWithProgress } from "../components/taskManagerFolders/utils/toastWithProgress";
import DeleteEventToast from "../components/taskManagerFolders/utils/deleteEventToast";
import { EventDetailsBtns } from "../components/common/EditDeleteEvent";

export default function Event() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const eventsState = useSelector((state) => state.events);
  const tasksState = useSelector((state) => state.tasks);

  // fetch tasks
  useEffect(() => {
    if (eventsState.items.length === 0) {
      dispatch(fetchEvents());
    }

    dispatch(clearTasks()); // ✅ Clear old tasks immediately
    dispatch(fetchTasks(id)); // ✅ Then load new tasks
  }, [dispatch, id]);

  const event = eventsState.items.find((event) => event._id === id);

  // handle loading state
  if (
    eventsState.status === "loading" ||
    tasksState.status === "loading" ||
    !event
  ) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading event...</p>
      </main>
    );
  }

  // handle failed state
  if (eventsState.status === "failed")
    return <p>Error loading event: {eventsState.error}</p>;
  if (!event) return <p>Event not found.</p>;

  // handle event delete
  const handleDelete = () => {
    const duration = 10000;
    toast(
      (t) => (
        <DeleteEventToast
          t={t}
          duration={duration}
          onConfirm={() => {
            dispatch(deleteEvent(id));
            toast.dismiss(t.id);
            toastWithProgress("Event deleted");
            navigate("/events");
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

  // handle task delete
  const handleTaskDelete = (taskId) => {
    dispatch(deleteTask(taskId))
      .unwrap()
      .then(() => toast.success("Task deleted"))
      .catch((err) => toast.error(`Failed to delete task: ${err}`));
  };

  return (
    <main className="p-6 min-h-screen bg-white max-w-4xl mx-auto">
      <div className="relative p-6 rounded-xl bg-[#FFF8F2] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#F3EDE9] border-l-4 border-l-[#F59E0B] mb-8">
        {/* edit/delete btns */}
        <EventDetailsBtns
          navigate={navigate}
          eventID={event._id}
          handleDelete={handleDelete}
        />

        {/* event type */}
        <div className="space-y-2">
          <p className="inline-block text-[11px] px-2 py-0.5 rounded-md bg-gradient-to-r from-[#F8D476] to-[#F59E0B]/70 text-[#6B3B0F] font-medium tracking-wide">
            {event.type}
          </p>
          {/* event name */}
          <h1 className="mt-3 text-2xl font-bold text-[#9B2C62]">
            {event.name}
          </h1>
          {/* event date */}
          <p className="text-sm text-gray-600 font-bold">
            {formatDateTime(event.date)}
          </p>
          {/* event desc */}
          <p className="text-sm text-gray-700">{event.description}</p>
          {/* event location */}
          <div className="grid sm:grid-cols-2 gap-2 pt-4 text-sm text-gray-600">
            <div>
              <span className="font-semibold text-gray-500">Venue:</span>{" "}
              {event.location.venue}
            </div>
            <div>
              <span className="font-semibold text-gray-500">Address:</span>{" "}
              {event.location.address}
            </div>
            <div>
              <span className="font-semibold text-gray-500">City:</span>{" "}
              {event.location.city}
            </div>
            <div>
              <span className="font-semibold text-gray-500">Country:</span>{" "}
              {event.location.country}
            </div>
            {/* event status */}
            <div>
              <span className="font-semibold text-gray-500">Status:</span>{" "}
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                  event.status
                )}`}
              >
                {event.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#9B2C62]">Tasks</h2>
        <button
          onClick={() => {
            if (showCreateTaskForm) {
              setTaskToEdit(null);
            }
            setShowCreateTaskForm(!showCreateTaskForm);
          }}
          className="flex items-center space-x-1 text-sm px-3 py-1.5 rounded-full bg-[#BE3455]/10 text-[#BE3455] hover:bg-[#BE3455]/20 transition text-xs cursor-pointer"
        >
          {showCreateTaskForm ? (
            <XCircle className="w-3 h-3" />
          ) : (
            <Plus className="w-3 h-3" />
          )}
          <span>{showCreateTaskForm ? "Cancel" : "Create Task"}</span>
        </button>
      </div>

      {/* show task creation form */}
      {showCreateTaskForm && (
        <div className="mb-6">
          <CreateTaskForm
            task={taskToEdit}
            onClose={() => {
              setShowCreateTaskForm(false);
              setTaskToEdit(null);
            }}
          />
        </div>
      )}

      {/* loading tasks */}
      {tasksState.status === "loading" && tasksState.items.length === 0 && (
        <p>Loading tasks...</p>
      )}
      {/* error loading tasks */}
      {tasksState.status === "failed" && (
        <p className="text-red-500">Error: {tasksState.error}</p>
      )}
      {tasksState.items.length === 0 && tasksState.status === "succeeded" && (
        <p className="text-gray-600">No tasks for this event.</p>
      )}
      {/* tasks display */}
      <ul className="grid sm:grid-cols-2 gap-4">
        {tasksState.items.map((task) => (
          <li
            key={task._id}
            className="relative bg-[#FFF8F2] border border-[#F3EDE9] rounded-xl shadow-md p-4 space-y-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="mb-2 text-md font-semibold text-[#9B2C62]">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-700">
                  {task.description || "No description."}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="text-[#9B2C62] hover:text-[#7b224e]"
                  title="Edit Task"
                  onClick={() => {
                    setTaskToEdit(task);
                    setShowCreateTaskForm(true);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  className="text-[#BE3455] hover:text-[#9B2C62]"
                  title="Delete Task"
                  onClick={() => handleTaskDelete(task._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 text-xs text-gray-600 gap-y-1 pt-2">
              <div>
                <span className="font-semibold text-gray-500">Priority:</span>{" "}
                <span
                  className={`inline-block px-2 py-0.5 rounded-full font-medium ${
                    task.priority === "High"
                      ? "bg-[#F59E0B]/20 text-[#C2410C]"
                      : task.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {task.priority}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-500">Status:</span>{" "}
                <span
                  className={`inline-block px-2 py-0.5 rounded-full font-medium ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : task.status === "In Review"
                      ? "bg-purple-100 text-purple-700"
                      : task.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-500">
                  Assigned To:
                </span>{" "}
                {task.assignedTo || "—"}
              </div>
              <div>
                <span className="font-semibold text-gray-500">Deadline:</span>{" "}
                {task.deadline
                  ? new Date(task.deadline).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </div>
            </div>

            <div className="text-[10px] text-gray-400 pt-2">
              Created: {new Date(task.createdAt).toLocaleString()}
              <br />
              Updated: {new Date(task.updatedAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
