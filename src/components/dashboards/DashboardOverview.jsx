import { CalendarRange, CheckSquare } from "lucide-react";

import { formatDashDate } from "../../globalUtils/dateHelpers";
import { truncateText } from "../taskManagerCollection/utils/formatting";
import { DashboardSectionError } from "./DashboardErrorStates";

function DashboardOverview({
  activeUpcomingEventsCount,
  dispatch,
  fetchEventsForDashboard,
  sortedActiveUpcomingEvents,
  totalEvents,
  navigate,
  eventsStatus,
  eventsFailed,
  tasksStatus,
  tasksFailed,
  sortedRecentTasks,
  fetchAllTasks,
  totalTasks,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Upcoming Events */}
      <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-5 border border-[#F3EDE9] dark:border-gray-600">
        <div className="flex items-center gap-3 mb-4">
          <CalendarRange className="w-5 h-5 text-[#9B2C62] dark:text-[#F59E0B]" />
          <h3 className="font-semibold text-gray-800 dark:text-white">
            Upcoming Events ({activeUpcomingEventsCount})
          </h3>
        </div>

        {eventsStatus === "loading" ? (
          <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Loading events…
          </div>
        ) : eventsFailed ? (
          <DashboardSectionError
            title="Events unavailable"
            description="We couldn’t load upcoming events."
            onRetry={() => dispatch(fetchEventsForDashboard())}
          />
        ) : (
          <ul className="space-y-3">
            {sortedActiveUpcomingEvents.length > 0 ? (
              sortedActiveUpcomingEvents.map((event) => (
                <li
                  key={event._id}
                  className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/30 rounded-lg hover:bg-white dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/events/${event._id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 dark:text-gray-300 font-medium truncate">
                      {event.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {event.type} • {event.location.city}
                    </p>
                  </div>
                  {/* <span className="text-xs text-[#9B2C62] px-2 py-1 bg-[#F59E0B]/10 dark:text-[#F59E0B] rounded-full whitespace-nowrap ml-2">
                    {formatDashDate(event.date)}
                  </span> */}
                  <span
                    className={`text-xs px-2 py-1 bg-[#F59E0B]/10 dark:text-[#F59E0B] rounded-full whitespace-nowrap ml-2 ${
                     formatDashDate(event.date).includes("day") ||  formatDashDate(event.date).includes("Tomorrow") ||  formatDashDate(event.date).includes("Today") ||  formatDashDate(event.date).includes("Overdue")
                        ? "text-red-600 dark:text-red-500 font-semibold bg-red-200 dark:bg-red-400/20"
                        : "text-[#9B2C62] dark:text-[#F59E0B] bg-[#F59E0B]/10"
                    }`}
                  >
                    {formatDashDate(event.date)}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 dark:text-gray-400 text-sm p-3 text-center">
                {totalEvents > 0 ? "No upcoming events" : "No events created"}
              </li>
            )}
          </ul>
        )}
        {eventsStatus !== "loading" && (
          <button
            onClick={() => navigate("/events/board")}
            className="mt-4 w-full py-2 text-sm font-medium text-[#9B2C62] dark:text-[#F59E0B] hover:bg-[#9B2C62]/5 dark:hover:bg-gray-700/30 rounded-lg transition-colors"
          >
            View All Events →
          </button>
        )}
      </div>

      {/* Recent Tasks */}
      <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-5 border border-[#F3EDE9] dark:border-gray-600">
        <div className="flex items-center gap-3 mb-4">
          <CheckSquare className="w-5 h-5 text-[#F59E0B] dark:text-[#F59E0B]" />
          <h3 className="font-semibold text-gray-800 dark:text-white">
            Upcoming Tasks ({sortedRecentTasks.length})
          </h3>
        </div>

        {tasksStatus === "loading" ? (
          <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Loading tasks…
          </div>
        ) : tasksFailed ? (
          <DashboardSectionError
            title="Tasks unavailable"
            description="We couldn’t load your tasks."
            onRetry={() => dispatch(fetchAllTasks())}
          />
        ) : (
          <ul className="space-y-3">
            {sortedRecentTasks.length > 0 ? (
              sortedRecentTasks.map((task) => (
                <li
                  key={task._id}
                  className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/30 rounded-lg hover:bg-white dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/events/${task.eventId}`)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 dark:text-gray-300 font-medium truncate">
                      {truncateText(task.title, 25)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {task.eventName || "Event task"} • {task.priority}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2 ${
                      task.status === "Completed"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : ""
                    } ${
                      formatDashDate(task.deadline).includes("day")
                        ? "text-red-600 dark:text-red-500 font-semibold bg-red-200 dark:bg-red-400/20"
                        : "text-[#9B2C62] dark:text-[#F59E0B] bg-[#F59E0B]/10"
                    }`}
                  >
                    {formatDashDate(task.deadline)}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 dark:text-gray-400 text-sm p-3 text-center">
                {totalTasks > 0
                  ? "No tasks with upcoming deadlines"
                  : "No tasks created"}
              </li>
            )}
          </ul>
        )}
        {tasksStatus !== "loading" && (
          <button
            onClick={() => navigate("/tasks/board")}
            className="mt-4 w-full py-2 text-sm font-medium text-[#9B2C62] dark:text-[#F59E0B] hover:bg-[#F59E0B]/5 dark:hover:bg-gray-700/30 rounded-lg transition-colors"
          >
            {totalTasks > 0 ? "Manage All Tasks →" : "Add Tasks →"}
          </button>
        )}
      </div>
    </div>
  );
}

export default DashboardOverview;
