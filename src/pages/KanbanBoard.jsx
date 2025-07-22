import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const KanbanBoard = () => {
  // Bogus data for demo
  const initialColumns = {
    backlog: {
      id: "backlog",
      title: "Backlog",
      tasks: [
        {
          id: "task1",
          title: "Book venue",
          event: "Tech Conference",
          due: "2023-11-15",
          priority: "high",
          assignee: "JD",
        },
        {
          id: "task2",
          title: "Design posters",
          event: "Marketing Launch",
          due: "2023-11-20",
          priority: "medium",
          assignee: "AS",
        },
      ],
    },
    todo: {
      id: "todo",
      title: "To Do",
      tasks: [
        {
          id: "task3",
          title: "Finalize speakers",
          event: "Tech Conference",
          due: "2023-11-10",
          priority: "high",
          assignee: "TM",
        },
      ],
    },
    inProgress: {
      id: "inProgress",
      title: "In Progress",
      tasks: [
        {
          id: "task4",
          title: "Build registration page",
          event: "Tech Conference",
          due: "2023-11-05",
          priority: "urgent",
          assignee: "RP",
        },
      ],
    },
    done: {
      id: "done",
      title: "Completed",
      tasks: [
        {
          id: "task5",
          title: "Send save-the-dates",
          event: "Marketing Launch",
          due: "2023-10-28",
          priority: "medium",
          assignee: "JD",
        },
      ],
    },
  };

  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    if (start === finish) {
      // Same column movement
      const newTasks = Array.from(start.tasks);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [start.id]: {
          ...start,
          tasks: newTasks,
        },
      });
      return;
    }

    // Moving between columns
    const startTasks = Array.from(start.tasks);
    const [removed] = startTasks.splice(source.index, 1);
    const finishTasks = Array.from(finish.tasks);
    finishTasks.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [start.id]: {
        ...start,
        tasks: startTasks,
      },
      [finish.id]: {
        ...finish,
        tasks: finishTasks,
      },
    });
  };

  return (
    <div className="p-4 bg-[#242424] min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Global Task Board</h1>

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
                          column.id === "backlog"
                            ? "#6B7280"
                            : column.id === "todo"
                            ? "#F59E0B"
                            : column.id === "inProgress"
                            ? "#3B82F6"
                            : "#10B981",
                      }}
                    ></span>
                    {column.title}
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
                            className="bg-[#3A3A3A] p-3 rounded-md shadow-sm"
                          >
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-white">
                                {task.title}
                              </h3>
                              {task.priority === "urgent" && (
                                <span className="text-xs bg-[#BE3455] text-white px-2 py-1 rounded-full">
                                  Urgent
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
                                #{task.id}
                              </span>
                              <span className="w-6 h-6 rounded-full bg-[#F59E0B] flex items-center justify-center text-white text-xs">
                                {task.assignee}
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
    </div>
  );
};

export default KanbanBoard;
