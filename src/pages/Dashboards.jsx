import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchEventsForDashboard } from "../redux/eventsSlice";
import { fetchAllTasks } from "../redux/tasksSlice";

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
import { GenLoadingState } from "../components/shared/LoadingStates";
import { DashboardPageError } from "../components/dashboards/DashboardErrorStates";
import DashboardCard from "../components/dashboards/DashboardCard";
import QuickStats from "../components/dashboards/QuickStats";
import DashboardOverview from "../components/dashboards/DashboardOverview";
import DashboardProgressStats from "../components/dashboards/DashboardProgressStats";
import NoEvent from "../components/shared/NoEvent";

const Dashboards = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasHydrated = useRef(false);

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

  // handle success/failure
  useEffect(() => {
    if (
      (eventsStatus === "succeeded" || eventsStatus === "failed") &&
      (tasksStatus === "succeeded" || tasksStatus === "failed")
    ) {
      hasHydrated.current = true;
    }
  }, [eventsStatus, tasksStatus]);

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

  // handle initial loading state
  const isInitialBlocking =
    !hasHydrated.current &&
    ((eventsStatus !== "succeeded" && eventsStatus !== "failed") ||
      (tasksStatus !== "succeeded" && tasksStatus !== "failed"));

  if (isInitialBlocking) {
    return <GenLoadingState message="Loading dashboard..." />;
  }

  // handle failed state
  const eventsFailed = eventsStatus === "failed";
  const tasksFailed = tasksStatus === "failed";

  if (eventsFailed && tasksFailed) {
    return (
      <DashboardPageError
        onRetry={() => {
          dispatch(fetchEventsForDashboard());
          dispatch(fetchAllTasks());
        }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF7ED] dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-4 sm:px-10 sm:pt-10 pb-15">
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
            <QuickStats
              stat={stat}
              key={index}
              totalExpenses={totalExpenses}
              pendingTasks={pendingTasks}
            />
          ))}
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {dashboardCards.map((dashboard) => (
            <DashboardCard
              key={dashboard.id}
              dashboard={dashboard}
              navigate={navigate}
            />
          ))}
        </div>

        {/* Recent Activity / Overview Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F3EDE9] shadow-sm p-6 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#9B2C62] dark:text-[#D97706]">
              Quick Overview
            </h2>
          </div>

          {/* Upcoming events and tasks */}
          {totalEvents === 0 && totalTasks === 0 ? (
            <NoEvent />
          ) : (
            <DashboardOverview
              activeUpcomingEventsCount={activeUpcomingEventsCount}
              dispatch={dispatch}
              fetchEventsForDashboard={fetchEventsForDashboard}
              sortedActiveUpcomingEvents={sortedActiveUpcomingEvents}
              totalEvents={totalEvents}
              navigate={navigate}
              eventsStatus={eventsStatus}
              eventsFailed={eventsFailed}
              tasksStatus={tasksStatus}
              tasksFailed={tasksFailed}
              sortedRecentTasks={sortedRecentTasks}
              fetchAllTasks={fetchAllTasks}
              totalTasks={totalTasks}
            />
          )}
        </div>

        {/* Stats Breakdown Section */}
        {(totalEvents > 0 || totalTasks > 0) && (
          <DashboardProgressStats
            eventsByStatus={eventsByStatus}
            totalEvents={totalEvents}
            tasksByStatus={tasksByStatus}
            totalTasks={totalTasks}
          />
        )}

        {/* Footer Note */}
        {totalEvents > 0 && (
          <div className="mt-10 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {`Tracking ${totalEvents} ${
                totalEvents > 0 ? "events" : "event"
              } and ${totalTasks}  ${totalTasks > 0 ? "tasks" : "task"}`}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboards;
