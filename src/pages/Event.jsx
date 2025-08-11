import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { fetchTasks, clearTasks, deleteTask } from "../redux/tasksSlice";
import { deleteEvent, fetchEventById } from "../redux/eventsSlice";
import { fetchExpenses, deleteExpense } from "../redux/expensesSlice";
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
import { createExpenseDeleteHandler } from "../components/taskManagerCollection/utils/handlers/expenseHandler";
import TasksTab from "../components/taskManagerCollection/tabs/TasksTab";
import BudgetTab from "../components/taskManagerCollection/tabs/BudgetTab";
import TabsBtns from "../components/taskManagerCollection/utils/tabBtns";
import BudgetOverview from "../components/taskManagerCollection/budgeting/BudgetOverview";
import { ClientInfo, VendorInfo } from "../components/shared/UIFragments";

export default function Event() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  initialize
  const [activeTab, setActiveTab] = useState("tasks");
  const [localVendors, setLocalVendors] = useState([]);
  // events, tasks and expenses selectors
  const eventsState = useSelector((state) => state.events);
  const tasksState = useSelector((state) => state.tasks);
  const expensesState = useSelector((state) => state.expenses);

  // fetch tasks
  useEffect(() => {
    dispatch(fetchEventById(id));
    dispatch(fetchExpenses(id));
    dispatch(clearTasks());
    dispatch(fetchTasks(id));
  }, [dispatch, id]);

  const event = eventsState.selectedEvent;

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

  // In your Event component, add this useEffect:
  useEffect(() => {}, [localVendors]);

  // handle event loading state
  if (
    eventsState.fetchOneStatus === "loading" ||
    tasksState.status === "loading" ||
    expensesState.status === "loading" ||
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
          (e) => e.vendor?._id === vendorId || e.vendor === vendorId
        ).length;

        if (vendorUsageCount <= 1) {
          setLocalVendors((prev) => prev.filter((v) => v._id !== vendorId));
        }
      } catch (error) {
        console.error("Error in vendor removal logic:", error);
      }
    }
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
          <div className="flex flex-wrap items-center gap-5 mt-10 sm:mt-0">
            <p className="inline-block text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-[#F8D476] to-[#F59E0B] text-[#6B3B0F] font-medium tracking-wide">
              {event.type}
            </p>
            {event.client && <ClientInfo event={event} Link={Link} />}
          </div>

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

          {/* vendors section */}
          {localVendors.length > 0 ? (
            <VendorInfo vendors={localVendors} Link={Link} />
          ) : (
            <div className="mt-4 text-xs text-gray-500 font-semibold">
              No vendors associated yet. Vendors will appear here when added
              through expenses.
            </div>
          )}

          {/* budget overview bar */}
          {expensesState.budgetStatus && (
            <BudgetOverview budgetStatus={expensesState.budgetStatus} />
          )}
        </div>

        {/* Event Summary */}
        {event.summary && (
          <div className="mt-6 p-4 rounded-lg bg-[#FFF5EB]/70 border border-[#F8D476]/50">
            <h4 className="text-xs font-bold text-[#9B2C62] uppercase tracking-wider mb-2 underline">
              Event Summary
            </h4>
            <p className="text-[#9B2C62] text-gray-700 text-xs font-semibold leading-relaxed">
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
    </main>
  );
}
