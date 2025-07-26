import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { fetchTasks, clearTasks, deleteTask } from "../redux/tasksSlice";
import { deleteEvent, fetchEventById } from "../redux/eventsSlice";
import { fetchExpenses } from "../redux/expensesSlice";
import {
  formatDateTime,
  getStatusColor,
} from "../components/taskManagerCollection/utils/formatting";
import { toastWithProgress } from "../globalHooks/useToastWithProgress";
import DeleteConfirmationToast from "../components/taskManagerCollection/utils/deleteConfirmationToast";
import { EventDetailsBtns } from "../components/shared/EditDeleteEvent";
import {
  EventLoadingState,
  TasksLoadingState,
} from "../components/shared/LoadingStates";
import { createEventDeleteHandler } from "../components/taskManagerCollection/utils/handlers/eventHandlers";
import { createTaskDeleteHandler } from "../components/taskManagerCollection/utils/handlers/taskHandlers";
import TasksTab from "../components/taskManagerCollection/tabs/TasksTab";
import BudgetTab from "../components/taskManagerCollection/tabs/BudgetTab";
import TabsBtns from "../components/taskManagerCollection/utils/tabBtns";

export default function Event() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  initialize tab state
  const [activeTab, setActiveTab] = useState("tasks");
  // events, tasks and expenses selectors
  const eventsState = useSelector((state) => state.events);
  const tasksState = useSelector((state) => state.tasks);
const expensesState = useSelector((state) => state.expenses);

  // fetch tasks
  useEffect(() => {
    dispatch(fetchEventById(id));
    dispatch(fetchExpenses(id))
    dispatch(clearTasks());
    dispatch(fetchTasks(id));
  }, [dispatch, id]);

  const event = eventsState.selectedEvent;

  // handle event loading state
  if (
    eventsState.fetchOneStatus === "loading" ||
    tasksState.status === "loading" ||
    !event
  ) {
    return <EventLoadingState />;
  }

  // For tasks loading
  {
    tasksState.status === "loading" && tasksState.items.length === 0 && (
      <TasksLoadingState />
    );
  }
  // handle failed state
  if (eventsState.status === "failed")
    return <p>Error loading event: {eventsState.error}</p>;
  if (!event) return <p>Event not found.</p>;

  // handle event delete
  const handleDelete = createEventDeleteHandler(
    dispatch,
    id,
    navigate,
    deleteEvent,
    toast,
    toastWithProgress,
    DeleteConfirmationToast
  );
  // handle task delete
  const handleTaskDelete = createTaskDeleteHandler(
    dispatch,
    deleteTask,
    toast,
    toastWithProgress,
    DeleteConfirmationToast
  );

  return (
    <main className="p-6 min-h-screen bg-white max-w-4xl mx-auto">
      {/* event card */}
      <div className="relative p-6 rounded-xl bg-[#FFF5EB] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#F3EDE9] border-l-4 border-l-[#F59E0B] mb-8">
        {/* edit/delete btns */}
        <EventDetailsBtns
          navigate={navigate}
          eventID={event._id}
          handleDelete={handleDelete}
        />

        {/* event details */}
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

      {/* Tabs Section */}
      {/* btns */}
      <TabsBtns activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* tasks tab */}
      {activeTab === "tasks" && (
        <TasksTab tasks={tasksState} handleTaskDelete={handleTaskDelete} />
      )}

      {/* budget tab */}
      {activeTab === "budget" && <BudgetTab />}
    </main>
  );
}
