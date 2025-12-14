import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, CalendarRange, CheckSquare, TrendingUp } from "lucide-react";

import { fetchEventsForDashboard } from "../redux/eventsSlice";
import { fetchAllTasks } from "../redux/tasksSlice";

import { DashEventsBar, DashTasksBar } from "../components/shared/UIFragments";
import { truncateText } from "../components/taskManagerCollection/utils/formatting";
import {
  getTotalEvents,
  getActiveUpcomingEventsCount,
  getSortedActiveUpcomingEvents,
  getTotalTasks,
  getPendingTasks,
  getCompletedTasks,
  getSortedRecentTasks,
  getTotalBudget,
  getTotalExpenses,
  groupEventByStatus,
  groupTasksByStatus,
} from "../components/dashboards/dashboardDeclarations";
import { createDashboardCards, createQuickStats } from "../data/dashboardData";
import { formatDashDate } from "../globalUtils/dateHelpers";

const Dashboards = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get events data from Redux store
  const { dashboardItems, dashboardStatus: eventsStatus } = useSelector(
    (state) => state.events
  );

  // Get tasks data from Redux store
  const { items: tasks, status: tasksStatus } = useSelector(
    (state) => state.tasks
  );

  // Fetch events and tasks data when component mounts
  useEffect(() => {
    dispatch(fetchEventsForDashboard());
    dispatch(fetchAllTasks());
  }, [dispatch]);

  // events statistics
  const totalEvents = getTotalEvents(dashboardItems);
  const sortedActiveUpcomingEvents =
    getSortedActiveUpcomingEvents(dashboardItems);
  const activeUpcomingEventsCount =
    getActiveUpcomingEventsCount(dashboardItems);

  // tasks statistics
  const totalTasks = getTotalTasks(tasks);
  const pendingTasks = getPendingTasks(tasks);
  const completedTasks = getCompletedTasks(tasks);
  const sortedRecentTasks = getSortedRecentTasks(tasks);

  // budget stats
  const totalBudget = getTotalBudget(dashboardItems);
  const totalExpenses = getTotalExpenses(dashboardItems);

  // Group events and tasks by status
  const eventsByStatus = groupEventByStatus(dashboardItems);
  const tasksByStatus = groupTasksByStatus(tasks);

  // quick stats
  const quickStats = createQuickStats({
    totalEvents,
    activeUpcomingEventsCount,
    activeUpcomingEventsCount,
    pendingTasks,
    completedTasks,
    totalExpenses,
    totalBudget,
  });

  // dashboard cards
  const dashboardCards = createDashboardCards({
    activeUpcomingEventsCount,
    pendingTasks,
    totalTasks,
    totalBudget,
  });

  // // Loading state
  // if (eventsStatus === "loading" || tasksStatus === "loading") {
  //   return (
  //     <main className="min-h-screen bg-[#FFF7ED] dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-3 sm:p-10 sm:pb-15">
  //       <div className="max-w-7xl mx-auto">
  //         <div className="flex justify-center items-center min-h-[400px]">
  //           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9B2C62] dark:border-[#F59E0B]"></div>
  //         </div>
  //       </div>
  //     </main>
  //   );
  // }

  return (
    <main className="min-h-screen bg-[#FFF7ED] dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-4 sm:px-10 sm:pt-10 pb-15">
      {/* loading state */}
      {(eventsStatus === "loading" || tasksStatus === "loading") && (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9B2C62] dark:border-[#F59E0B]"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-8">
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#F59E0B]/10 rounded-full blur-lg dark:bg-[#F59E0B]/20"></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#9B2C62]/10 rounded-full blur-lg dark:bg-[#9B2C62]/20"></div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#9B2C62] dark:text-[#D97706] mt-10 mb-2 sm:my-2 text-center">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-4">
              Monitor everything at a glance - track upcoming events, pending
              tasks and budget status from your centralized command center.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-[#F3EDE9] shadow-sm hover:shadow-md transition-shadow bg-[#FFF9F5] border border-gray-200 p-3 rounded-md shadow-xs hover:shadow-md dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                    {stat.value}
                  </p>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full mt-2 inline-block ${
                      (stat.label === "Total Budget" && totalExpenses === 0) ||
                      (stat.label === "Pending Tasks" && pendingTasks === 0)
                        ? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {dashboardCards.map((dashboard) => (
            <div
              key={dashboard.id}
              className="group relative bg-gradient-to-br from-white to-[#FFF8F2] dark:from-gray-800/80 dark:to-gray-900/80 rounded-2xl border border-[#F3EDE9] dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 cursor-pointer"
              onClick={() =>
                dashboard.path &&
                (dashboard.id === "tasks" ? totalTasks > 0 : true) &&
                navigate(dashboard.path)
              }
            >
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity">
                <div
                  className={`${dashboard.color} w-full h-full rounded-bl-full`}
                ></div>
              </div>

              <div className="p-6">
                {/* Icon Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-xl ${dashboard.color}`}>
                    <dashboard.icon
                      className={`w-8 h-8 ${dashboard.iconColor}`}
                    />
                  </div>
                  {dashboard.statValue && (
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-800 dark:text-white">
                        {dashboard.statValue}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {dashboard.stats}
                      </p>
                    </div>
                  )}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  {dashboard.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {dashboard.description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {dashboard.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full border border-[#F3EDE9] dark:border-gray-600"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dashboard.path && navigate(dashboard.path);
                  }}
                  className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    dashboard.id === "analytics" ||
                    (dashboard.id === "tasks" && totalTasks === 0)
                      ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                      : `${dashboard.color
                          .split(" ")[0]
                          .replace(
                            "bg-gradient-to-br",
                            "bg"
                          )} text-white hover:opacity-90`
                  }`}
                  disabled={
                    dashboard.id === "analytics" ||
                    (dashboard.id === "tasks" && totalTasks === 0)
                  }
                >
                  {dashboard.id === "analytics"
                    ? "Coming Soon"
                    : dashboard.id === "tasks" && totalTasks === 0
                    ? "No Tasks Yet"
                    : "Open Dashboard"}
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#9B2C62]/20 dark:group-hover:border-[#F59E0B]/20 rounded-2xl transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Recent Activity / Overview Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F3EDE9] shadow-sm p-6 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#9B2C62] dark:text-[#D97706]">
              Quick Overview
            </h2>
            {/* <span className="text-sm text-gray-500 dark:text-gray-400">
              {totalEvents > 0
                ? `${totalEvents} events, ${totalTasks} tasks`
                : "No data yet"}
            </span> */}
          </div>

          {totalEvents === 0 && totalTasks === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Get started by creating your first event or task
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate("/events/new")}
                  className="inline-flex items-center px-4 py-2 bg-[#9B2C62] text-white rounded-lg shadow hover:bg-[#801f4f] transition"
                >
                  + Create Event
                </button>
                <button
                  onClick={() => navigate("/events")}
                  className="inline-flex items-center px-4 py-2 bg-[#F59E0B] text-white rounded-lg shadow hover:bg-[#D97706] transition"
                >
                  + Add Task
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upcoming Events */}
              <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-5 border border-[#F3EDE9] dark:border-gray-600">
                <div className="flex items-center gap-3 mb-4">
                  <CalendarRange className="w-5 h-5 text-[#9B2C62] dark:text-[#F59E0B]" />
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    Upcoming Events ({activeUpcomingEventsCount})
                  </h3>
                </div>
                <ul className="space-y-3">
                  {sortedActiveUpcomingEvents.length > 0 ? (
                    sortedActiveUpcomingEvents.map((event, index) => (
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
                        <span className="text-xs text-[#9B2C62] px-2 py-1 bg-[#F59E0B]/10 dark:text-[#F59E0B] rounded-full whitespace-nowrap ml-2">
                          {formatDashDate(event.date)}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 dark:text-gray-400 text-sm p-3 text-center">
                      {totalEvents > 0
                        ? "No upcoming events"
                        : "No events created"}
                    </li>
                  )}
                </ul>
                <button
                  onClick={() => navigate("/events/board")}
                  className="mt-4 w-full py-2 text-sm font-medium text-[#9B2C62] dark:text-[#F59E0B] hover:bg-[#9B2C62]/5 dark:hover:bg-gray-700/30 rounded-lg transition-colors"
                >
                  View All Events →
                </button>
              </div>

              {/* Recent Tasks */}
              <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-5 border border-[#F3EDE9] dark:border-gray-600">
                <div className="flex items-center gap-3 mb-4">
                  <CheckSquare className="w-5 h-5 text-[#F59E0B] dark:text-[#F59E0B]" />
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    Upcoming Tasks ({sortedRecentTasks.length})
                  </h3>
                </div>
                <ul className="space-y-3">
                  {sortedRecentTasks.length > 0 ? (
                    sortedRecentTasks.map((task, index) => (
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
                              : "bg-[#F59E0B]/10 text-[#9B2C62] dark:text-[#F59E0B]"
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
                <button
                  onClick={() => navigate("/tasks/board")}
                  className="mt-4 w-full py-2 text-sm font-medium text-[#9B2C62] dark:text-[#F59E0B] hover:bg-[#F59E0B]/5 dark:hover:bg-gray-700/30 rounded-lg transition-colors"
                >
                  {totalTasks > 0 ? "Manage All Tasks →" : "Add Tasks →"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Breakdown Section */}
        {(totalEvents > 0 || totalTasks > 0) && (
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
                    <div
                      key={status}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-700 dark:text-gray-300">
                        {statusLabels[status]}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${DashEventsBar(
                              statusLabels[status]
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
                            (events.length / Math.max(totalEvents, 1)) * 100
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
                {Object.entries(tasksByStatus).map(([status, tasksList]) => {
                  if (!tasksList || tasksList.length === 0) return null;

                  return (
                    <div
                      key={status}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-700 dark:text-gray-300">
                        {status}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${DashTasksBar(
                              status
                            )}`}
                            style={{
                              width: `${
                                (tasksList.length / Math.max(totalTasks, 1)) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
                          (
                          {Math.round(
                            (tasksList.length / Math.max(totalTasks, 1)) * 100
                          )}
                          %)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        {totalEvents > 0 && (
          <div className="mt-10 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {`Tracking ${totalEvents} events and ${totalTasks} tasks`}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboards;
