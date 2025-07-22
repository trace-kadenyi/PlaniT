import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllTasks,
  updateTask,
  clearUpdateError,
} from "../redux/tasksSlice";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const KanbanBoard = () => {
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
  const mapTaskToCard = useCallback(
    (task) => ({
      id: task._id,
      title: task.title,
      event: task.eventName || task.eventId?.name || "Unassigned",
      due: task.deadline
        ? new Date(task.deadline).toLocaleDateString()
        : "No deadline",
      priority: task.priority.toLowerCase(),
      assignee: task.assignedTo,
      status: task.status,
    }),
    []
  );

  // Memoize the columns creation
  const getColumnsFromTasks = useCallback(() => {
    const filteredTasks = {
      todo: sortedTasks.filter((task) => task.status === "To Do"),
      inProgress: sortedTasks.filter((task) => task.status === "In Progress"),
      inReview: sortedTasks.filter((task) => task.status === "In Review"),
      completed: sortedTasks.filter((task) => task.status === "Completed"),
    };

    return {
      todo: {
        id: "todo",
        title: "To Do",
        tasks: filteredTasks.todo.map(mapTaskToCard),
        color: "#F59E0B",
      },
      inProgress: {
        id: "inProgress",
        title: "In Progress",
        tasks: filteredTasks.inProgress.map(mapTaskToCard),
        color: "#FF7E33",
      },
      inReview: {
        id: "inReview",
        title: "In Review",
        tasks: filteredTasks.inReview.map(mapTaskToCard),
        color: "#9B2C62",
      },
      completed: {
        id: "completed",
        title: "Completed",
        tasks: filteredTasks.completed.map(mapTaskToCard),
        color: "#4CAF50",
      },
    };
  }, [sortedTasks, mapTaskToCard]);

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
    if (fetchStatus === "idle") {
      dispatch(fetchAllTasks());
    }
  }, [fetchStatus, dispatch]);

  // Update columns when tasks change
  useEffect(() => {
    if (tasks.length > 0 || fetchStatus === "succeeded") {
      setColumns(getColumnsFromTasks());
    }
  }, [tasks, fetchStatus, getColumnsFromTasks]);

  //   drag and drop function
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination || source.droppableId === destination.droppableId) return;

    const statusMap = {
      todo: "To Do",
      inProgress: "In Progress",
      inReview: "In Review",
      completed: "Completed",
    };
    const newStatus = statusMap[destination.droppableId];

    // Find the original task with populated event data
    const originalTask = tasks.find((task) => task._id === draggableId);
    if (!originalTask) return;

    // Store current columns for rollback
    const currentColumns = columns;

    try {
      // Optimistic update
      setColumns((prevColumns) => {
        const newColumns = JSON.parse(JSON.stringify(prevColumns));
        const sourceColumn = newColumns[source.droppableId];
        const destColumn = newColumns[destination.droppableId];

        // Find and remove the task
        const taskIndex = sourceColumn.tasks.findIndex(
          (t) => t.id === draggableId
        );
        if (taskIndex === -1) return prevColumns;

        const [movedTask] = sourceColumn.tasks.splice(taskIndex, 1);

        // Create new task with guaranteed event data
        const updatedTask = {
          ...movedTask,
          status: newStatus,
          event:
            originalTask.eventName ||
            originalTask.eventId?.name ||
            "Unassigned",
        };

        destColumn.tasks.splice(destination.index, 0, updatedTask);

        return newColumns;
      });

      // API update
      await dispatch(
        updateTask({
          taskId: draggableId,
          updatedData: { status: newStatus },
        })
      ).unwrap();
    } catch (err) {
      setColumns(currentColumns);
      console.error("Task update failed:", err);
    }
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-[#9B2C62] my-6 text-center">Task Board</h1>
      {/* update error */}
      {updateError && (
        <div className="p-3 bg-red-50 text-red-600 rounded mb-4 flex justify-between">
          <span>Update failed: {updateError}</span>
          <button
            onClick={() => dispatch(clearUpdateError())}
            className="text-[#9B2C62] font-medium"
          >
            Retry
          </button>
        </div>
      )}
      {/* error fetching tasks */}
      {fetchError && (
        <div className="p-3 bg-red-50 text-red-600 rounded mb-4">
          Failed to load tasks: {fetchError}
        </div>
      )}

      {/* loading state */}
      {fetchStatus === "loading" ? (
        <div className="flex space-x-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 w-72 h-64"></div>
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-4 overflow-x-auto pb-4 justify-center">
            {Object.values(columns).map((column) => (
              <Droppable droppableId={column.id} key={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-white border border-gray-200 rounded-lg p-4 w-72 flex-shrink-0 shadow-sm"
                  >
                    <h2 className="font-semibold text-[#9B2C62] mb-4 flex items-center">
                      <span
                        className="inline-block w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: column.color }}
                      ></span>
                      {column.title} ({column.tasks.length})
                    </h2>

                    <div className="space-y-3">
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
                                <span className="bg-[#9B2C62] text-white px-2 py-1 rounded mr-2">
                                  {task.event}
                                </span>
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
};

export default KanbanBoard;
