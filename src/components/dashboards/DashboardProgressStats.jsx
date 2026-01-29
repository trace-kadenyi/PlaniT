import { DashEventsBar, DashTasksBar } from "../shared/UIFragments";

function DashboardProgressStats({
  eventsByStatus,
  totalEvents,
  tasksByStatus,
  totalTasks,
}) {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Events by Status */}
      <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-5 border border-[#F3EDE9] dark:border-gray-600">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
          Events by Status
        </h3>
        <div className="space-y-3">
          {Object.entries(eventsByStatus).map(([status, events]) => {
            if (events.length === 0 && totalEvents > 0) return null;

            const statusLabels = {
              planning: "Planning",
              "in-progress": "In Progress",
              completed: "Completed",
              cancelled: "Cancelled",
            };

            return (
              <div key={status} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  {statusLabels[status]}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${DashEventsBar(
                        statusLabels[status],
                      )}`}
                      style={{
                        width: `${
                          (events.length / Math.max(totalEvents, 1)) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
                    {/* {events.length}  */}(
                    {Math.round(
                      (events.length / Math.max(totalEvents, 1)) * 100,
                    )}
                    %)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tasks by Status */}
      <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-5 border border-[#F3EDE9] dark:border-gray-600">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
          Tasks by Status
        </h3>
        <div className="space-y-3">
          {totalTasks === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              No tasks yet
            </p>
          ) : (
            Object.entries(tasksByStatus).map(([status, tasksList]) => {
              if (!tasksList || tasksList.length === 0) return null;

              return (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    {status}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${DashTasksBar(status)}`}
                        style={{
                          width: `${
                            (tasksList.length / Math.max(totalTasks, 1)) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
                      (
                      {Math.round(
                        (tasksList.length / Math.max(totalTasks, 1)) * 100,
                      )}
                      %)
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardProgressStats;
