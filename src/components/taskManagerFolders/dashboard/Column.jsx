import { Droppable, Draggable } from "@hello-pangea/dnd";
import DashTaskCard from "./dashTaskCard";

export default function Column({ columns }) {
  return (
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
                  <Draggable key={task.id} draggableId={task.id} index={index}>
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
                        <DashTaskCard task={task} />
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
  );
}
