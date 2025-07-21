import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, Trash2, Plus, XCircle } from "lucide-react";
import toast from "react-hot-toast";

import { fetchTasks, clearTasks, deleteTask } from "../redux/tasksSlice";
import { fetchEvents, deleteEvent } from "../redux/eventsSlice";
import CreateTaskForm from "../components/taskManagerFolders/tasks/CreateTaskForm";
import EditTaskForm from "../components/taskManagerFolders/tasks/EditTasksForm";
import {
  formatDateTime,
  getStatusColor,
} from "../components/taskManagerFolders/utils/formatting";
import { toastWithProgress } from "../components/taskManagerFolders/utils/toastWithProgress";
import DeleteConfirmationToast from "../components/taskManagerFolders/utils/deleteConfirmationToast";
import { EventDetailsBtns } from "../components/common/EditDeleteEvent";
import TaskCard from "../components/ui/TaskCard";

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

  // handle event loading state
  if (
    eventsState.status === "loading" ||
    tasksState.status === "loading" ||
    !event
  ) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-10 h-10 border-4 border-[#F59E0B]/30 border-t-[#F59E0B] rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500">Loading event details...</p>
        </div>
      </main>
    );
  }

  // For tasks loading
  {
    tasksState.status === "loading" && tasksState.items.length === 0 && (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-2 border-[#9B2C62]/30 border-t-[#9B2C62] rounded-full animate-spin"></div>
      </div>
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
        <DeleteConfirmationToast
          t={t}
          duration={duration}
          type="event"
          onConfirm={() => {
            dispatch(deleteEvent(id));
            toast.dismiss(t.id);
            toastWithProgress("Event deleted successfully");
            navigate("/events");
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      { duration, position: "top-center" }
    );
  };

  // handle task delete
  const handleTaskDelete = (taskId) => {
    const duration = 10000;
    toast(
      (t) => (
        <DeleteConfirmationToast
          t={t}
          duration={duration}
          type="task"
          onConfirm={() => {
            dispatch(deleteTask(taskId))
              .unwrap()
              .then(() => {
                toast.dismiss(t.id);
                toastWithProgress("Task deleted successfully");
              })
              .catch((err) => {
                toast.dismiss(t.id);
                toastWithProgress(`Failed to delete task: ${err}`);
              });
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      { duration, position: "top-center" }
    );
  };

  return (
    <main className="p-6 min-h-screen bg-white max-w-4xl mx-auto">
      <div className="relative p-6 rounded-xl bg-[#FFF5EB] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#F3EDE9] border-l-4 border-l-[#F59E0B] mb-8">
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
          {taskToEdit ? (
            <EditTaskForm
              task={taskToEdit}
              onClose={() => {
                setTaskToEdit(null);
                setShowCreateTaskForm(false);
              }}
            />
          ) : (
            <CreateTaskForm
              onClose={() => {
                setShowCreateTaskForm(false);
              }}
            />
          )}
        </div>
      )}

      {/* loading tasks */}
      {tasksState.status === "loading" && tasksState.items.length === 0 && (
        <p>Loading tasks...</p>
      )}

      {tasksState.items.length === 0 && tasksState.status === "succeeded" && (
        <p className="text-gray-600">No tasks for this event.</p>
      )}
      {/* tasks display */}
      {
        <TaskCard
          tasks={tasksState.items}
          setTaskToEdit={setTaskToEdit}
          setShowCreateTaskForm={setShowCreateTaskForm}
          handleTaskDelete={handleDelete}
        />
      }
    </main>
  );
}
