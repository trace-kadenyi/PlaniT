import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { fetchTasks, clearTasks, deleteTask } from "../redux/tasksSlice";
import {
  archiveEvent,
  deleteEvent,
  fetchEventById,
  restoreEvent,
} from "../redux/eventsSlice";
import { fetchExpenses, deleteExpense } from "../redux/expensesSlice";

import { toastWithProgress } from "../globalHooks/useToastWithProgress";
import DeleteConfirmationToast from "../components/taskManagerCollection/utils/deleteConfirmationToast";
import {
  EventLoadingState,
  TasksLoadingState,
} from "../components/shared/LoadingStates";
import { createLockedDeleteHandler } from "../components/taskManagerCollection/utils/handlers/eventHandlers";
import { createTaskDeleteHandler } from "../components/taskManagerCollection/utils/handlers/taskHandlers";
import { createExpenseDeleteHandler } from "../components/taskManagerCollection/utils/handlers/expenseHandler";
import TasksTab from "../components/taskManagerCollection/tabs/TasksTab";
import BudgetTab from "../components/taskManagerCollection/tabs/BudgetTab";
import TabsBtns from "../components/taskManagerCollection/utils/tabBtns";
import EventDetailsCard from "../components/taskManagerCollection/events/EventDetailsCard";
import { useSmoothScrollToTask } from "../components/taskManagerCollection/hooks/useSmoothScrollToTask";
import { EventDetailsBtns } from "../components/buttons/EventButtons";
import { GenNoEvent, NoPermissionEvent } from "../components/shared/NoEvent";

export default function Event() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const deleteEventToastRef = useRef(null);
  const scrollTaskId = location.state?.scrollToTaskId;
  const scrollNonce = location.state?.scrollNonce;

  //  initialize
  const [activeTab, setActiveTab] = useState("tasks");
  const [localVendors, setLocalVendors] = useState([]);
  // events, tasks and expenses selectors
  const eventsState = useSelector((state) => state.events);
  const tasksState = useSelector((state) => state.tasks);
  const expensesState = useSelector((state) => state.expenses);
  const event = eventsState.selectedEvent;

  // fetch tasks
  useEffect(() => {
    dispatch(fetchEventById(id));
    dispatch(fetchExpenses(id));
    dispatch(clearTasks());
    dispatch(fetchTasks(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (scrollTaskId) {
      setActiveTab("tasks");
    }
  }, [scrollTaskId]);

  // handle smooth scrolling for task
  useSmoothScrollToTask(scrollTaskId, scrollNonce, id);

  // Helper function to ensure unique vendors
  const getUniqueVendors = (vendors) => {
    return [...(vendors || [])].reduce((acc, vendor) => {
      if (vendor?._id && !acc.some((v) => v._id === vendor._id)) {
        acc.push(vendor);
      }
      return acc;
    }, []);
  };

  // Initialize local vendors when event data loads
  useEffect(() => {
    if (event?.vendors) {
      setLocalVendors(getUniqueVendors(event.vendors));
    }
  }, [event?.vendors]);

  // handle event loading state
  // FIRST: Check for errors
  if (eventsState.fetchOneStatus === "failed") {
    return <NoPermissionEvent eventsState={eventsState} navigate={navigate} />;
  }

  // SECOND: Check for loading
  if (
    eventsState.fetchOneStatus === "loading" ||
    tasksState.status === "loading" ||
    expensesState.status === "loading"
  ) {
    return <EventLoadingState />;
  }

  // THIRD: Check if event exists (after loading is complete)
  if (!event) {
    return <GenNoEvent navigate={navigate} />;
  }

  // handle event delete
  const handleDelete = createLockedDeleteHandler(
    dispatch,
    deleteEvent,
    toast,
    toastWithProgress,
    DeleteConfirmationToast,
    deleteEventToastRef,
  );

  // handle task delete
  const handleTaskDelete = createTaskDeleteHandler(
    dispatch,
    deleteTask,
    toast,
    toastWithProgress,
    DeleteConfirmationToast,
  );

  // handle archive toggle
  const handleArchiveToggle = (eventId, isArchived) => {
    const action = isArchived ? restoreEvent : archiveEvent;
    dispatch(action(eventId));
  };

  // handle delete expense
  const handleExpenseDelete = createExpenseDeleteHandler(
    dispatch,
    deleteExpense,
    toast,
    toastWithProgress,
    DeleteConfirmationToast,
    (vendorId, expenses) => {
      try {
        // Add null check and default to empty array
        const safeExpenses = expenses || [];

        // Check if vendor is used by other expenses
        const vendorUsageCount = safeExpenses.filter(
          (e) => e.vendor?._id === vendorId || e.vendor === vendorId,
        ).length;

        if (vendorUsageCount <= 1) {
          setLocalVendors((prev) => prev.filter((v) => v._id !== vendorId));
        }
      } catch (error) {
        console.error("Error in vendor removal logic:", error);
      }
    },
  );

  return (
    <main className="dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black">
      <div className="p-6 py-15 min-h-screen bg-white dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black max-w-4xl mx-auto">
        {/* event card */}
        <div className="relative p-6 rounded-xl bg-[#FFF5EB] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#F3EDE9] border-l-4 border-l-[#F59E0B] mb-8 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)] dark:border-l-[#F59E0B]">
          {/* edit/delete btns */}
          <EventDetailsBtns
            key={`event-btns-${event._id}-${event.isArchived}`}
            navigate={navigate}
            eventID={event._id}
            eventName={event.name}
            isArchived={event.isArchived || false}
            isArchiving={eventsState.archivingEvents[event._id] || false}
            isRestoring={eventsState.restoringEvents[event._id] || false}
            handleArchiveToggle={handleArchiveToggle}
            handleDelete={handleDelete}
          />

          {/* event details */}
          <EventDetailsCard
            event={event}
            Link={Link}
            localVendors={localVendors}
            expensesState={expensesState}
            id={id}
          />

          {/* Event Summary */}
          {event.summary && (
            <div className="mt-6 p-4 rounded-lg bg-[#FFF5EB]/70 border border-[#F8D476]/50 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 dark:border-gray-900">
              <h4 className="text-xs font-bold text-[#9B2C62] dark:text-[#D97706] uppercase tracking-wider mb-2 underline">
                Event Summary
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-xs font-semibold leading-relaxed">
                {event.summary}
              </p>
            </div>
          )}
        </div>

        {/* Tabs Section */}
        {/* btns */}
        <TabsBtns activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* tasks tab */}
        {activeTab === "tasks" && (
          <TasksTab tasks={tasksState} handleTaskDelete={handleTaskDelete} />
        )}

        {/* budget tab */}
        {activeTab === "budget" && (
          <BudgetTab
            expenses={expensesState.items}
            budgetStatus={expensesState.budgetStatus}
            handleExpenseDelete={handleExpenseDelete}
            setLocalVendors={setLocalVendors}
            Link={Link}
            onVendorAdded={(newVendor) => {
              setLocalVendors((prev) => {
                const vendorExists = prev.some((v) => v._id === newVendor._id);
                return vendorExists ? prev : [...prev, newVendor];
              });
            }}
            onVendorRemoved={(vendorId) => {
              setLocalVendors((prev) => prev.filter((v) => v._id !== vendorId));
            }}
          />
        )}
      </div>
    </main>
  );
}
