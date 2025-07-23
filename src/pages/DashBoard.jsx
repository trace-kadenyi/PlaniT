import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTasks, clearUpdateError } from "../redux/tasksSlice";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import {
  mapTaskToCard,
  getColumnsFromTasks,
  handleDragEnd,
  LoadingDashboard,
  UpdateDashboardError,
} from "../utils/dashboardHelpers";

export default function DashBoard() {
  const dispatch = useDispatch();
  const {
    items: tasks,
    status: fetchStatus,
    error: fetchError,
    updateError,
  } = useSelector((state) => state.tasks);

  //   sorted tasks
  const sortedTasks = useMemo(
    () =>
      [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)),
    [tasks]
  );

  // Memoize the task mapping function
  const mapTaskToCardMemoized = useCallback(mapTaskToCard, []);

  // Memoize the columns creation
  const getColumnsFromTasksMemoized = useCallback(() => {
    return getColumnsFromTasks(sortedTasks, mapTaskToCardMemoized);
  }, [sortedTasks, mapTaskToCardMemoized]);

  // Initialize columns with empty state
  const [columns, setColumns] = useState(() => ({
    todo: { id: "todo", title: "To Do", tasks: [], color: "#F59E0B" },
    inProgress: {
      id: "inProgress",
      title: "In Progress",
      tasks: [],
      color: "#FF7E33",
    },
    inReview: {
      id: "inReview",
      title: "In Review",
      tasks: [],
      color: "#9B2C62",
    },
    completed: {
      id: "completed",
      title: "Completed",
      tasks: [],
      color: "#4CAF50",
    },
  }));

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
      </div>
      {/* update error */}
      {updateError && (
        <UpdateDashboardError updateError={updateError} dispatch={dispatch} />
      )}
      {/* error fetching tasks */}
      {fetchError && (
        <div className="p-3 bg-red-50 text-red-600 rounded mb-4">
          Failed to load tasks: {fetchError}
        </div>
      )}

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
                              {...provided.dragHandleProps}
                              className="bg-[#FFF9F5] border border-gray-200 p-3 rounded-md shadow-xs hover:shadow-md transition-shadow"
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
                                    onClick={(e) => e.stopPropagation()} // Prevent drag when clicking
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
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {task.priority}
                                </span>
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
