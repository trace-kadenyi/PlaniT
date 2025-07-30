import { Droppable, Draggable } from "@hello-pangea/dnd";
import DashEventCard from "./DashEventCard";

export default function EventColumn({ columns }) {
  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 overflow-x-auto pb-4 px-2 md:justify-center">
      {Object.values(columns).map((column) => (
        <Droppable droppableId={column.id} key={column.id}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="bg-white border border-gray-200 rounded-lg p-4 w-full md:w-72 flex-shrink-0 shadow-sm flex flex-col"
              style={{
                minHeight: "200px",
                maxHeight: "calc(100vh - 16rem)",
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
                {column.tasks.map((event, index) => (
                  <Draggable
                    key={event.id}
                    draggableId={event.id}
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
                        {/* Event card content */}
                        <DashEventCard event={event} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {column.tasks.length === 0 && (
                  <div className="text-gray-400 text-sm italic p-2 text-center">
                    No events here yet
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
