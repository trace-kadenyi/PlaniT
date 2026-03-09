import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext } from "@hello-pangea/dnd";

import { fetchAllTasks, clearUpdateError } from "../redux/tasksSlice";
import { fetchEvents } from "../redux/eventsSlice";

import {
  mapTaskToCard,
  getColumnsFromTasks,
  handleDragEnd,
  getInitialColumns,
} from "../components/taskManagerCollection/tasks/tasksDashboard/tasksDashboardHelpers";
import {
  LoadingDashboard,
  FetchDashboardError,
  UpdateDashboardError,
} from "../components/taskManagerCollection/utils/genDashboardHelpers";
import FilterBox from "../components/shared/FilterBox";
import { tasksFilterConfig } from "../components/taskManagerCollection/config/tasksFilterConfig";
import TaskColumn from "../components/taskManagerCollection/tasks/tasksDashboard/TaskColumn";
import {
  useTaskFilters,
  useAssignees,
} from "../components/taskManagerCollection/hooks/useTaskFilters";
import { usePermissions } from "../globalHooks/userPermissions";

export default function TasksBoard() {
  // Track whether columns have been initialized to prevent unnecessary recalculations
  const [columnsInitialized, setColumnsInitialized] = useState(false);

  // Filter state (priority, assignee, date range, search)
  const [filters, setFilters] = useState({
    priority: "all",
    assignee: "all",
    dateRange: "all",
    search: "",
  });

  // Custom date range for advanced filtering
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: "",
  });

  const dispatch = useDispatch();
  const { can } = usePermissions();

  // Get tasks from Redux store
  const {
    items: tasks,
    status: fetchStatus,
    error: fetchError,
    updateError,
  } = useSelector((state) => state.tasks);
  const { items: eventsItems, status: eventsStatus } = useSelector(
    (state) => state.events,
  );

  const activeEventIds = new Set(
    eventsItems.filter((e) => !e.isArchived && !e.isDeleted).map((e) => e._id),
  );

  const activeTasks = tasks.filter((task) => {
    const eventId =
      typeof task.eventId === "object" ? task.eventId._id : task.eventId;
    return activeEventIds.has(eventId);
  });

  // Memoize task-to-card mapping to prevent unnecessary recalculations
  const mapTaskToCardMemoized = useCallback(mapTaskToCard, []);
  const filteredTasks = useTaskFilters(activeTasks, filters, customDateRange);
  const assignees = useAssignees(activeTasks);

  // Memoize columns generation to optimize performance
  const getColumnsFromTasksMemoized = useCallback(() => {
    return getColumnsFromTasks(filteredTasks, mapTaskToCardMemoized);
  }, [filteredTasks, mapTaskToCardMemoized]);

  // Initialize columns with empty state
  const [columns, setColumns] = useState(getInitialColumns);

  // Fetch tasks on initial render
  useEffect(() => {
    dispatch(fetchAllTasks());
    dispatch(fetchEvents());
  }, [dispatch]);

  // Update columns when tasks load or search filter changes
  useEffect(() => {
    if (fetchStatus === "succeeded" && eventsStatus === "succeeded") {
      // Only update columns if not initialized OR if search filter changes
      if (!columnsInitialized || filters.search) {
        setColumns(getColumnsFromTasksMemoized());
      }
      if (!columnsInitialized) setColumnsInitialized(true);
    }
  }, [
    fetchStatus,
    eventsStatus,
    filteredTasks,
    columnsInitialized,
    filters.search,
  ]);

  // Recalculate columns when priority/assignee/date filters change
  useEffect(() => {
    if (
      columnsInitialized &&
      fetchStatus === "succeeded" &&
      eventsStatus === "succeeded"
    ) {
      setColumns(getColumnsFromTasksMemoized());
    }
  }, [filters.priority, filters.assignee, filters.dateRange, customDateRange]);

  // Handle drag-and-drop reordering
  const onDragEnd = useCallback(
    (result) => {
      handleDragEnd(result, {
        tasks: activeTasks,
        columns,
        setColumns,
        dispatch,
        can,
      });
    },
    [tasks, columns, setColumns, dispatch, can],
  );

  // Refresh tasks and reset column state
  const refreshTasks = useCallback(() => {
    setColumnsInitialized(false);
    dispatch(fetchAllTasks());
  }, [dispatch]);

  // refresh task on page load
  useEffect(() => {
    refreshTasks();
  }, []);

  return (
    <div className="p-4 sm:px-10 sm:pt-10 pb-15 bg-white dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[#9B2C62] dark:text-[#D97706] mt-10 mb-2 sm:my-2">
          Tasks Board
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-4">
          Drag and drop tasks between columns to update their status - stay
          organized and track your workflow at a glance!
        </p>

        {/* Filter controls */}
        <FilterBox
          filters={filters}
          setFilters={setFilters}
          customDateRange={customDateRange}
          setCustomDateRange={setCustomDateRange}
          filterConfig={{
            ...tasksFilterConfig,
            dynamicData: { assignees: assignees },
          }}
        />
      </div>

      {/* Error messages */}
      {updateError && (
        <UpdateDashboardError
          updateError={updateError}
          dispatch={dispatch}
          clearError={clearUpdateError}
        />
      )}
      {fetchError && (
        <FetchDashboardError
          message={"Failed to load tasks"}
          fetchError={fetchError}
        />
      )}

      {/* Main content */}
      {fetchStatus === "loading" || eventsStatus === "loading" ? (
        <LoadingDashboard />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <TaskColumn columns={columns} />
        </DragDropContext>
      )}
    </div>
  );
}
