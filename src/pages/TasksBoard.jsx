import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTasks } from "../redux/tasksSlice";
import { DragDropContext } from "@hello-pangea/dnd";

import {
  mapTaskToCard,
  getColumnsFromTasks,
  handleDragEnd,
  LoadingDashboard,
  UpdateDashboardError,
  FetchDashboardError,
  getInitialColumns,
} from "../components/taskManagerCollection/utils/tasksDashboardHelpers";
import FilterBox from "../components/taskManagerCollection/FilterBox";
import { tasksFilterConfig } from "../components/taskManagerCollection/config/tasksFilterConfig";
import TaskColumn from "../components/taskManagerCollection/tasks/tasksDashboard/TaskColumn";
import {
  useTaskFilters,
  useAssignees,
} from "../components/taskManagerCollection/hooks/useFilters";

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

  // Get tasks from Redux store
  const {
    items: tasks,
    status: fetchStatus,
    error: fetchError,
    updateError,
  } = useSelector((state) => state.tasks);

  // Memoize task-to-card mapping to prevent unnecessary recalculations
  const mapTaskToCardMemoized = useCallback(mapTaskToCard, []);
  const filteredTasks = useTaskFilters(tasks, filters, customDateRange);
  const assignees = useAssignees(tasks);

  // Memoize columns generation to optimize performance
  const getColumnsFromTasksMemoized = useCallback(() => {
    return getColumnsFromTasks(filteredTasks, mapTaskToCardMemoized);
  }, [filteredTasks, mapTaskToCardMemoized]);

  // Initialize columns with empty state
  const [columns, setColumns] = useState(getInitialColumns);

  // Fetch tasks on initial render
  useEffect(() => {
    dispatch(fetchAllTasks());
  }, [dispatch]);

  // Update columns when tasks load or search filter changes
  useEffect(() => {
    if (fetchStatus === "succeeded") {
      // Only update columns if not initialized OR if search filter changes
      if (!columnsInitialized || filters.search) {
        setColumns(getColumnsFromTasksMemoized());
      }
      if (!columnsInitialized) setColumnsInitialized(true);
    }
  }, [fetchStatus, filteredTasks, columnsInitialized, filters.search]);

  // Recalculate columns when priority/assignee/date filters change
  useEffect(() => {
    if (columnsInitialized && fetchStatus === "succeeded") {
      setColumns(getColumnsFromTasksMemoized());
    }
  }, [filters.priority, filters.assignee, filters.dateRange, customDateRange]);

  // Handle drag-and-drop reordering
  const onDragEnd = useCallback(
    (result) => {
      handleDragEnd(result, { tasks, columns, setColumns, dispatch });
    },
    [tasks, columns, setColumns, dispatch]
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
    <div className="p-4 bg-white min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[#9B2C62] my-2">Task Board</h1>
        <p className="text-gray-600 max-w-4xl mx-auto mb-4">
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
        <UpdateDashboardError updateError={updateError} dispatch={dispatch} />
      )}
      {fetchError && <FetchDashboardError fetchError={fetchError} />}

      {/* Main content */}
      {fetchStatus === "loading" ? (
        <LoadingDashboard />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <TaskColumn columns={columns} />
        </DragDropContext>
      )}
    </div>
  );
}
