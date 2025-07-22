import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTasks, updateTask } from "../redux/tasksSlice";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const KanbanBoard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.items);
  const status = useSelector((state) => state.tasks.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllTasks());
    }
  }, [status, dispatch]);

  // Transform tasks into kanban columns
  const getColumnsFromTasks = () => {
    return {
      todo: {
        id: "todo",
        title: "To Do",
        tasks: tasks
          .filter((task) => task.status === "To Do")
          .map(mapTaskToCard),
        color: "#F59E0B", // Saffron gold
      },
      inProgress: {
        id: "inProgress",
        title: "In Progress",
        tasks: tasks
          .filter((task) => task.status === "In Progress")
          .map(mapTaskToCard),
        color: "#FF7E33", // Pumpkin
      },
      inReview: {
        id: "inReview",
        title: "In Review",
        tasks: tasks
          .filter((task) => task.status === "In Review")
          .map(mapTaskToCard),
        color: "#9B2C62", // Deep mulberry
      },
      completed: {
        id: "completed",
        title: "Completed",
        tasks: tasks
          .filter((task) => task.status === "Completed")
          .map(mapTaskToCard),
        color: "#4CAF50", // Complementary green
      },
    };
  };

  const mapTaskToCard = (task) => ({
    id: task._id,
    title: task.title,
    event: task.eventId?.name || "Unassigned",
    due: task.deadline
      ? new Date(task.deadline).toLocaleDateString()
      : "No deadline",
    priority: task.priority.toLowerCase(),
    assignee: task.assignedTo,
    status: task.status,
  });

  const [columns, setColumns] = useState(getColumnsFromTasks());

  useEffect(() => {
    setColumns(getColumnsFromTasks());
  }, [tasks]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    // Map column IDs to status values
    const statusMap = {
      todo: "To Do",
      inProgress: "In Progress",
      inReview: "In Review",
      completed: "Completed",
    };
    const newStatus = statusMap[destination.droppableId];

    // Optimistic update
    setColumns((prevColumns) => {
      const newColumns = { ...prevColumns };
      const sourceTasks = [...newColumns[source.droppableId].tasks];
      const [movedTask] = sourceTasks.splice(source.index, 1);

      // Create updated task data
      const updatedTask = {
        ...movedTask,
        status: newStatus,
      };

      newColumns[destination.droppableId].tasks.splice(
        destination.index,
        0,
        updatedTask
      );
      return newColumns;
    });

    try {
      // Use your existing updateTask thunk
      await dispatch(
        updateTask({
          taskId: draggableId,
          updatedData: { status: newStatus }, // Only send the changed field
        })
      ).unwrap();
    } catch (err) {
      // Revert on error
      setColumns(getColumnsFromTasks());
      console.error("Status update failed:", err);
    }
  };

  // Show loading state during updates
  if (updateTask === 'loading') {
    return <div className="p-4 text-[#9B2C62]">Updating task...</div>;
  }

  return (
    <div className="p-4 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-[#9B2C62] mb-6">Task Board</h1>

      {status === "loading" ? (
        <div className="text-[#9B2C62]">Loading tasks...</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-4 overflow-x-auto pb-4">
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
