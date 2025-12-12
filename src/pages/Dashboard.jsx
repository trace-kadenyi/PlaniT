import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Calendar,
  CalendarRange,
  CheckSquare,
  TrendingUp,
  BarChart3,
  Users,
  FileText,
} from "lucide-react";
import { fetchEventsForDashboard } from "../redux/eventsSlice";

const Dashboards = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get events data from Redux store
  const { dashboardItems, dashboardStatus } = useSelector(
    (state) => state.events
  );

  // Get users data from Redux store (assuming you have it in organization slice)
  const { users } = useSelector((state) => state.organization);

  // Fetch events data when component mounts
  useEffect(() => {
    dispatch(fetchEventsForDashboard());
  }, [dispatch]);

  // Calculate real statistics
  const totalEvents = dashboardItems.length;
  const upcomingEvents = dashboardItems.filter(event => 
    new Date(event.date) > new Date()
  ).length;
  
  const activeEvents = dashboardItems.filter(event => 
    event.status === 'in-progress' || event.status === 'planning'
  ).length;

  // Calculate total budget across all events
  const totalBudget = dashboardItems.reduce((sum, event) => {
    const budget = event.budgetStatus?.totalBudget || 0;
    return sum + budget;
  }, 0);

  // Calculate total expenses across all events
  const totalExpenses = dashboardItems.reduce((sum, event) => {
    const expenses = event.budgetStatus?.totalExpenses || 0;
    return sum + expenses;
  }, 0);

  // Get upcoming events sorted by date (closest first)
  const sortedUpcomingEvents = [...dashboardItems]
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  // Group events by status for quick overview
  const eventsByStatus = {
    planning: dashboardItems.filter(event => event.status === 'planning'),
    'in-progress': dashboardItems.filter(event => event.status === 'in-progress'),
    completed: dashboardItems.filter(event => event.status === 'completed'),
    cancelled: dashboardItems.filter(event => event.status === 'cancelled')
  };

  const dashboardCards = [
    {
      id: "events",
      title: "Events Board",
      description:
        "Track and manage all your events. Drag and drop to update status in real-time.",
      icon: CalendarRange,
      color: "bg-gradient-to-br from-[#9B2C62] to-[#801f4f]",
      iconColor: "text-white",
      path: "/dashboard/events-board",
      stats: "Active events",
      statValue: activeEvents.toString(),
      features: ["Drag & Drop", "Budget Tracking", "Status Updates"],
    },
    {
      id: "tasks",
      title: "Tasks Board",
      description:
        "Organize team tasks with Kanban boards. Assign, track progress, and set deadlines.",
      icon: CheckSquare,
      color: "bg-gradient-to-br from-[#F59E0B] to-[#D97706]",
      iconColor: "text-white",
      path: "/dashboard/tasks-board",
      stats: "Coming Soon",
      statValue: "",
      features: ["Kanban Boards", "Assignments", "Deadlines"],
    },
    {
      id: "analytics",
      title: "Analytics",
      description:
        "Detailed insights and reports on events, budgets, and team performance.",
      icon: BarChart3,
      color: "bg-gradient-to-br from-[#EA580C] to-[#C2410C]",
      iconColor: "text-white",
      path: "/dashboard/analytics",
      stats: "Total Budget",
      statValue: totalBudget > 0 ? `$${totalBudget.toLocaleString()}` : "",
      features: ["Reports", "Insights", "Metrics"],
    },
  ];

  const quickStats = [
    {
      label: "Total Events",
      value: totalEvents.toString(),
      change: `+${upcomingEvents} upcoming`,
      icon: Calendar,
      color: "bg-[#9B2C62]/10 dark:bg-[#9B2C62]/20",
      textColor: "text-[#9B2C62] dark:text-[#F59E0B]",
    },
    {
      label: "Active Events",
      value: activeEvents.toString(),
      change: `${Math.round((activeEvents / totalEvents) * 100) || 0}%`,
      icon: CalendarRange,
      color: "bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20",
      textColor: "text-[#F59E0B] dark:text-[#F59E0B]",
    },
    {
      label: "Team Members",
      value: users?.length?.toString() || "0",
      change: users?.length > 0 ? `${users.length} active` : "Add members",
      icon: Users,
      color: "bg-[#EA580C]/10 dark:bg-[#EA580C]/20",
      textColor: "text-[#EA580C] dark:text-[#F59E0B]",
    },
    {
      label: "Total Budget",
      value: totalBudget > 0 ? `$${(totalBudget / 1000).toFixed(0)}k` : "$0",
      change: totalExpenses > 0 ? `$${totalExpenses.toLocaleString()} spent` : "No spending",
      icon: FileText,
      color: "bg-[#801f4f]/10 dark:bg-[#801f4f]/20",
      textColor: "text-[#801f4f] dark:text-[#F59E0B]",
    },
  ];

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 30) return `In ${Math.floor(diffDays/7)} weeks`;
    return date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
  };

  // Loading state
  if (dashboardStatus === "loading") {
    return (
      <main className="min-h-screen bg-[#FFF7ED] dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-3 sm:p-10 sm:pb-15">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9B2C62] dark:border-[#F59E0B]"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF7ED] dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-3 sm:p-10 sm:pb-15">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-8">
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#F59E0B]/10 rounded-full blur-lg dark:bg-[#F59E0B]/20"></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#9B2C62]/10 rounded-full blur-lg dark:bg-[#9B2C62]/20"></div>

          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#9B2C62] dark:text-[#D97706] mt-4">
              Dashboards
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl">
              {totalEvents > 0 
                ? `Managing ${totalEvents} events with ${users?.length || 0} team members`
                : "Central hub for managing all your events, tasks, and analytics"}
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
                  <span className={`text-xs font-medium px-2 py-1 rounded-full mt-2 inline-block ${
                    stat.label === "Total Budget" && totalExpenses === 0 
                      ? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  }`}>
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
              onClick={() => dashboard.path && navigate(dashboard.path)}
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
                    dashboard.id === "tasks" || dashboard.id === "analytics"
                      ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                      : `${dashboard.color
                          .split(" ")[0]
                          .replace(
                            "bg-gradient-to-br",
                            "bg"
                          )} text-white hover:opacity-90`
                  }`}
                  disabled={dashboard.id === "tasks" || dashboard.id === "analytics"}
                >
                  {dashboard.id === "tasks" || dashboard.id === "analytics"
                    ? "Coming Soon"
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
              Events Overview
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {totalEvents > 0 ? `${totalEvents} total events` : "No events yet"}
            </span>
          </div>

          {totalEvents === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-4">No events created yet</p>
              <button
                onClick={() => navigate("/events/new")}
                className="inline-flex items-center px-4 py-2 bg-[#9B2C62] text-white rounded-lg shadow hover:bg-[#801f4f] transition"
              >
                + Create Your First Event
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upcoming Events */}
              <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-5 border border-[#F3EDE9] dark:border-gray-600">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-[#9B2C62] dark:text-[#F59E0B]" />
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    Upcoming Events ({upcomingEvents})
                  </h3>
                </div>
                <ul className="space-y-3">
                  {sortedUpcomingEvents.length > 0 ? (
                    sortedUpcomingEvents.map((event, index) => (
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
                        <span className="text-xs px-2 py-1 bg-[#F59E0B]/10 text-[#F59E0B] rounded-full whitespace-nowrap ml-2">
                          {formatDate(event.date)}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 dark:text-gray-400 text-sm p-3 text-center">
                      No upcoming events
                    </li>
                  )}
                </ul>
                <button
                  onClick={() => navigate("/dashboard/events-board")}
                  className="mt-4 w-full py-2 text-sm font-medium text-[#9B2C62] dark:text-[#F59E0B] hover:bg-[#9B2C62]/5 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  View All Events →
                </button>
              </div>

              {/* Events by Status */}
              <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-5 border border-[#F3EDE9] dark:border-gray-600">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-5 h-5 text-[#F59E0B] dark:text-[#F59E0B]" />
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    Events by Status
                  </h3>
                </div>
                <ul className="space-y-3">
                  {Object.entries(eventsByStatus).map(([status, events]) => {
                    if (events.length === 0) return null;
                    
                    const statusColors = {
                      'planning': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                      'in-progress': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
                      'completed': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                      'cancelled': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    };
                    
                    const statusLabels = {
                      'planning': 'Planning',
                      'in-progress': 'In Progress',
                      'completed': 'Completed',
                      'cancelled': 'Cancelled'
                    };
                    
                    return (
                      <li
                        key={status}
                        className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/30 rounded-lg"
                      >
                        <span className="text-gray-700 dark:text-gray-300">
                          {statusLabels[status]}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>
                            {events.length} event{events.length !== 1 ? 's' : ''}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {Math.round((events.length / totalEvents) * 100)}%
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <button
                  onClick={() => navigate("/events")}
                  className="mt-4 w-full py-2 text-sm font-medium text-[#F59E0B] dark:text-[#F59E0B] hover:bg-[#F59E0B]/5 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Manage All Events →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {totalEvents > 0 
              ? `Tracking ${totalEvents} events with ${totalBudget > 0 ? `$${totalBudget.toLocaleString()} budget` : 'no budget set'}`
              : "Get started by creating your first event"}
          </p>
          {totalEvents === 0 && (
            <button
              onClick={() => navigate("/events/new")}
              className="mt-4 inline-flex items-center px-4 py-2 bg-[#9B2C62] text-white rounded-lg shadow hover:bg-[#801f4f] transition"
            >
              + Create Your First Event
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboards;