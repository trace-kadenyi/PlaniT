import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTasks } from "../redux/tasksSlice";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import {
  mapTaskToCard,
  getColumnsFromTasks,
  handleDragEnd,
  LoadingDashboard,
  UpdateDashboardError,
  FetchDashboardError,
  getInitialColumns,
  filterTasks,
} from "../utils/dashboardHelpers";
import { filterByDateRange, dateFilters } from "../utils/dashboardDateHandlers";
import FilterBox from "../components/ui/FilterBox";

export default function DashBoard() {
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

  // Extract unique assignees for filter dropdown
  const assignees = useMemo(() => {
    const uniqueAssignees = new Set();
    tasks.forEach((task) => {
      if (task.assignedTo) uniqueAssignees.add(task.assignedTo);
    });
    return ["all", ...Array.from(uniqueAssignees)];
  }, [tasks]);

  // Apply all active filters to tasks
  const filteredTasks = useMemo(() => {
    return filterTasks(
      tasks,
      filters,
      filterByDateRange,
      filters.dateRange === "custom" ? customDateRange : null
    );
  }, [tasks, filters, customDateRange]);

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
          assignees={assignees}
          dateFilters={dateFilters}
          customDateRange={customDateRange}
          setCustomDateRange={setCustomDateRange}
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
          <div className="flex space-x-4 overflow-x-auto pb-4 justify-center">
            {Object.values(columns).map((column) => (
              <Droppable droppableId={column.id} key={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-white border border-gray-200 rounded-lg p-4 w-72 flex-shrink-0 shadow-sm flex flex-col"
                    style={{
                      height: "calc(100vh - 14rem)",
                      minHeight: "200px",
                    }}
                  >
                    <h2 className="font-semibold text-[#9B2C62] mb-4 flex items-center">
                      <span
                        className="inline-block w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: column.color }}
                      ></span>
                      {column.title} ({column.tasks.length})
                    </h2>

                    <div className="space-y-3 overflow-y-auto flex-1">
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="bg-[#FFF9F5] border border-gray-200 p-3 rounded-md shadow-xs hover:shadow-md transition-shadow relative"
                            >
                              {/* Drag handle (invisible overlay) */}
                              <div
                                {...provided.dragHandleProps}
                                className="absolute inset-0 cursor-grab z-10"
                                style={{ pointerEvents: "auto" }}
                              />

                              {/* Task card content */}
                              <div
                                className="relative z-20"
                                style={{ pointerEvents: "none" }}
                              >
                                <div className="flex justify-between items-start">
                                  <h3 className="font-medium text-gray-800">
                                    {task.title}
                                  </h3>
                                  {task.priority === "high" && (
                                    <span className="text-xs bg-[#F59E0B] text-white px-2 py-1 rounded-full">
                                      {task.priority}
                                    </span>
                                  )}
                                </div>

                                <div className="mt-2 flex items-center text-xs text-gray-600">
                                  {task.eventId ? (
                                    <Link
                                      to={`/events/${task.eventId}`}
                                      className="bg-[#9B2C62] text-white px-2 py-1 rounded mr-2 hover:underline"
                                      style={{ pointerEvents: "auto" }}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {task.event}
                                    </Link>
                                  ) : (
                                    <span className="bg-[#9B2C62] text-white px-2 py-1 rounded mr-2">
                                      {task.event}
                                    </span>
                                  )}
                                  <span>Due: {task.due}</span>
                                </div>

                                <div className="mt-3 flex justify-between items-center text-xs">
                                  <span className="text-gray-500">
                                    {task.assignee}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded ${
                                      task.priority === "high"
                                        ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                                        : task.priority === "medium"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-200 text-gray-800"
                                    }`}
                                  >
                                    {task.priority}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {column.tasks.length === 0 && (
                        <div className="text-gray-400 text-sm italic p-2 text-center">
                          No tasks here yet
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
