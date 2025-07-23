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

export default function DashBoard() {
  // filter state
  const [filters, setFilters] = useState({
    priority: "all",
    assignee: "all",
    dateRange: "all",
    search: "",
  });
  // custom date range
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: "",
  });
  // dispatch
  const dispatch = useDispatch();

  // tasks
  const {
    items: tasks,
    status: fetchStatus,
    error: fetchError,
    updateError,
  } = useSelector((state) => state.tasks);

  // sorted tasks
  const sortedTasks = useMemo(
    () =>
      [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)),
    [tasks]
  );

  // Memoize the task mapping function
  const mapTaskToCardMemoized = useCallback(mapTaskToCard, []);

  // Get unique assignees for filter dropdown
  const assignees = useMemo(() => {
    const uniqueAssignees = new Set();
    tasks.forEach((task) => {
      if (task.assignedTo) uniqueAssignees.add(task.assignedTo);
    });
    return ["all", ...Array.from(uniqueAssignees)];
  }, [tasks]);

  // // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return filterTasks(
      sortedTasks,
      filters,
      filterByDateRange,
      filters.dateRange === "custom" ? customDateRange : null
    );
  }, [sortedTasks, filters, customDateRange]);

  // Memoize the columns creation
  const getColumnsFromTasksMemoized = useCallback(() => {
    return getColumnsFromTasks(filteredTasks, mapTaskToCardMemoized);
  }, [filteredTasks, mapTaskToCardMemoized]);

  // Initialize columns with empty state
  const [columns, setColumns] = useState(() => getInitialColumns);

  // Fetch all tasks
  useEffect(() => {
    dispatch(fetchAllTasks());
  }, [dispatch]);

  // Update columns when tasks change
  useEffect(() => {
    if (tasks.length > 0 || fetchStatus === "succeeded") {
      setColumns(getColumnsFromTasksMemoized());
    }
  }, [tasks, fetchStatus, getColumnsFromTasksMemoized]);

  //   drag and drop function
  const onDragEnd = useCallback(
    (result) => handleDragEnd(result, { tasks, columns, setColumns, dispatch }),
    [tasks, columns, setColumns, dispatch]
  );

  return (
    <div className="p-4 bg-white min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[#9B2C62] my-2">Task Board</h1>
        <p className="text-gray-600 max-w-4xl mx-auto">
          Drag and drop tasks between columns to update their status. Tasks are
          automatically sorted by due date - stay organized and track your
          workflow at a glance!
        </p>

        {/* Filter Controls */}
        <div className="w-full max-w-md mx-auto mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full rounded-md border-gray-300 shadow-sm pl-10 pr-4 py-2 focus:border-[#9B2C62] focus:ring focus:ring-[#9B2C62] focus:ring-opacity-50"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          {/* priority filter */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="priority-filter"
              className="text-sm font-medium text-gray-700"
            >
              Priority:
            </label>
            <select
              id="priority-filter"
              className="rounded-md border-gray-300 shadow-sm focus:border-[#9B2C62] focus:ring focus:ring-[#9B2C62] focus:ring-opacity-50"
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* assignee filter */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="assignee-filter"
              className="text-sm font-medium text-gray-700"
            >
              Assignee:
            </label>
            <select
              id="assignee-filter"
              className="rounded-md border-gray-300 shadow-sm focus:border-[#9B2C62] focus:ring focus:ring-[#9B2C62] focus:ring-opacity-50"
              value={filters.assignee}
              onChange={(e) =>
                setFilters({ ...filters, assignee: e.target.value })
              }
            >
              {assignees.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee === "all" ? "All Assignees" : assignee}
                </option>
              ))}
            </select>
          </div>
          {/* due date filter */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="date-filter"
              className="text-sm font-medium text-gray-700"
            >
              Due Date:
            </label>
            <select
              id="date-filter"
              className="rounded-md border-gray-300 shadow-sm focus:border-[#9B2C62] focus:ring focus:ring-[#9B2C62] focus:ring-opacity-50"
              value={filters.dateRange}
              onChange={(e) =>
                setFilters({ ...filters, dateRange: e.target.value })
              }
            >
              {Object.entries(dateFilters).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Add this new section for custom date range */}
          {filters.dateRange === "custom" && (
            <div className="flex items-center gap-2 w-full justify-center mt-2">
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) =>
                    setCustomDateRange({
                      ...customDateRange,
                      start: e.target.value,
                    })
                  }
                  className="rounded-md border-gray-300 shadow-sm p-1"
                />
                <span className="text-gray-600">to</span>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) =>
                    setCustomDateRange({
                      ...customDateRange,
                      end: e.target.value,
                    })
                  }
                  className="rounded-md border-gray-300 shadow-sm p-1"
                />
              </div>
            </div>
          )}
          {/* clear tasks */}
          <div>
            <button
              onClick={() => {
                setFilters({
                  priority: "all",
                  assignee: "all",
                  dateRange: "all",
                  search: "",
                });
                setCustomDateRange({ start: "", end: "" });
              }}
              className="text-sm text-[#9B2C62] hover:underline ml-2"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      {/* update error */}
      {updateError && (
        <UpdateDashboardError updateError={updateError} dispatch={dispatch} />
      )}
      {/* error fetching tasks */}
      {fetchError && <FetchDashboardError fetchError={fetchError} />}

      {/* loading state */}
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
                              <div
                                {...provided.dragHandleProps}
                                className="absolute inset-0 cursor-grab z-10"
                                style={{ pointerEvents: "auto" }}
                              />

                              {/* Card content */}
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        e.nativeEvent.stopImmediatePropagation();
                                      }}
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
