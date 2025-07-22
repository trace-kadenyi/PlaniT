import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTasks } from "../redux/tasksSlice";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const KanbanBoard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.items);
  const status = useSelector((state) => state.tasks.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllTasks());
    }
  }, [status, dispatch]);

  // Transform tasks into kanban columns based on schema statuses
  const getColumnsFromTasks = () => {
    return {
      todo: {
        id: 'todo',
        title: 'To Do',
        tasks: tasks.filter(task => task.status === 'To Do')
                   .map(mapTaskToCard)
      },
      inProgress: {
        id: 'inProgress',
        title: 'In Progress',
        tasks: tasks.filter(task => task.status === 'In Progress')
                   .map(mapTaskToCard)
      },
      inReview: {
        id: 'inReview',
        title: 'In Review',
        tasks: tasks.filter(task => task.status === 'In Review')
                   .map(mapTaskToCard)
      },
      completed: {
        id: 'completed',
        title: 'Completed',
        tasks: tasks.filter(task => task.status === 'Completed')
                   .map(mapTaskToCard)
      }
    };
  };

  // Helper to transform task to card format
  const mapTaskToCard = (task) => ({
    id: task._id,
    title: task.title,
    event: task.eventId?.name || 'Unassigned',
    due: task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline',
    priority: task.priority.toLowerCase(),
    assignee: task.assignedTo,
    status: task.status, // Include status for updates
    originalData: task // Keep reference to original
  });

  const [columns, setColumns] = useState(getColumnsFromTasks());

  // Update columns when tasks change
  useEffect(() => {
    setColumns(getColumnsFromTasks());
  }, [tasks]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    // Determine new status based on destination column
    const newStatus = {
      'todo': 'To Do',
      'inProgress': 'In Progress',
      'inReview': 'In Review',
      'completed': 'Completed'
    }[destination.droppableId];

    try {
      // Optimistic UI update
      const updatedColumns = { ...columns };
      const sourceTasks = [...updatedColumns[source.droppableId].tasks];
      const [movedTask] = sourceTasks.splice(source.index, 1);
      
      movedTask.status = newStatus;
      updatedColumns[destination.droppableId].tasks.splice(destination.index, 0, movedTask);
      setColumns(updatedColumns);

      // TODO: Dispatch Redux action to update task status in backend
      // await dispatch(updateTaskStatus({ taskId: draggableId, status: newStatus }));
      
    } catch (err) {
      // Revert if update fails
      setColumns(getColumnsFromTasks());
    }
  };

  return (
    <div className="p-4 bg-[#242424] min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Task Board</h1>

      {status === 'loading' ? (
        <div className="text-white">Loading tasks...</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {Object.values(columns).map((column) => (
              <Droppable droppableId={column.id} key={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-[#2D2D2D] rounded-lg p-4 w-72 flex-shrink-0"
                  >
                    <h2 className="font-semibold text-white mb-4 flex items-center">
                      <span 
                        className="inline-block w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            column.id === "todo" ? "#F59E0B" :
                            column.id === "inProgress" ? "#3B82F6" :
                            column.id === "inReview" ? "#8B5CF6" : "#10B981"
                        }}
                      ></span>
                      {column.title} ({column.tasks.length})
                    </h2>

                    <div className="space-y-3">
                      {column.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-[#3A3A3A] p-3 rounded-md shadow-sm"
                            >
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium text-white">
                                  {task.title}
                                </h3>
                                {task.priority === 'high' && (
                                  <span className="text-xs bg-[#BE3455] text-white px-2 py-1 rounded-full">
                                    {task.priority}
                                  </span>
                                )}
                              </div>

                              <div className="mt-2 flex items-center text-xs text-gray-300">
                                <span className="bg-[#9B2C62] px-2 py-1 rounded mr-2">
                                  {task.event}
                                </span>
                                <span>Due: {task.due}</span>
                              </div>

                              <div className="mt-3 flex justify-between items-center">
                                <span className="text-xs text-gray-400">
                                  {task.assignee}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
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