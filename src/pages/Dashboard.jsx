import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CheckSquare,
  TrendingUp,
  BarChart3,
  Users,
  FileText,
} from "lucide-react";

const Dashboards = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      id: "events",
      title: "Events Board",
      description:
        "Track and manage all your events. Drag and drop to update status in real-time.",
      icon: Calendar,
      color: "bg-gradient-to-br from-[#9B2C62] to-[#801f4f]",
      iconColor: "text-white",
      path: "/dashboard/events-board",
      stats: "Active events",
      statValue: "12",
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
      stats: "Pending tasks",
      statValue: "24",
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
      stats: "Coming Soon",
      statValue: "",
      features: ["Reports", "Insights", "Metrics"],
    },
  ];

  const quickStats = [
    {
      label: "Total Events",
      value: "18",
      change: "+12%",
      icon: Calendar,
      color: "bg-[#9B2C62]/10 dark:bg-[#9B2C62]/20",
      textColor: "text-[#9B2C62] dark:text-[#F59E0B]",
    },
    {
      label: "Active Tasks",
      value: "42",
      change: "+5%",
      icon: CheckSquare,
      color: "bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20",
      textColor: "text-[#F59E0B] dark:text-[#F59E0B]",
    },
    {
      label: "Team Members",
      value: "8",
      change: "+2",
      icon: Users,
      color: "bg-[#EA580C]/10 dark:bg-[#EA580C]/20",
      textColor: "text-[#EA580C] dark:text-[#F59E0B]",
    },
    {
      label: "Reports",
      value: "6",
      change: "New",
      icon: FileText,
      color: "bg-[#801f4f]/10 dark:bg-[#801f4f]/20",
      textColor: "text-[#801f4f] dark:text-[#F59E0B]",
    },
  ];

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
              Central hub for managing all your events, tasks, and analytics in
              one place
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-[#F3EDE9] dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                    {stat.value}
                  </p>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 mt-2 inline-block">
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
                    dashboard.id === "analytics"
                      ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                      : `${dashboard.color
                          .split(" ")[0]
                          .replace(
                            "bg-gradient-to-br",
                            "bg"
                          )} text-white hover:opacity-90`
                  }`}
                  disabled={dashboard.id === "analytics"}
                >
                  {dashboard.id === "analytics"
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
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-[#F3EDE9] dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#9B2C62] dark:text-[#D97706]">
              Quick Overview
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Updated just now
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming Events */}
            <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-5 border border-[#F3EDE9] dark:border-gray-600">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-[#9B2C62] dark:text-[#F59E0B]" />
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Upcoming Events
                </h3>
              </div>
              <ul className="space-y-3">
                {["Annual Conference", "Team Building", "Product Launch"].map(
                  (event, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/30 rounded-lg"
                    >
                      <span className="text-gray-700 dark:text-gray-300">
                        {event}
                      </span>
                      <span className="text-xs px-2 py-1 bg-[#F59E0B]/10 text-[#F59E0B] rounded-full">
                        {index === 0 ? "Tomorrow" : "Next week"}
                      </span>
                    </li>
                  )
                )}
              </ul>
              <button
                onClick={() => navigate("/dashboard/events-board")}
                className="mt-4 w-full py-2 text-sm font-medium text-[#9B2C62] dark:text-[#F59E0B] hover:bg-[#9B2C62]/5 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                View All Events →
              </button>
            </div>

            {/* Recent Tasks */}
            <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-5 border border-[#F3EDE9] dark:border-gray-600">
              <div className="flex items-center gap-3 mb-4">
                <CheckSquare className="w-5 h-5 text-[#F59E0B] dark:text-[#F59E0B]" />
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Recent Tasks
                </h3>
              </div>
              <ul className="space-y-3">
                {[
                  { task: "Finalize budget", status: "completed" },
                  { task: "Send invitations", status: "in-progress" },
                  { task: "Book venue", status: "pending" },
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/30 rounded-lg"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.task}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.status === "completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          : item.status === "in-progress"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/dashboard/tasks-board")}
                className="mt-4 w-full py-2 text-sm font-medium text-[#F59E0B] dark:text-[#F59E0B] hover:bg-[#F59E0B]/5 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                View All Tasks →
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Need help? Check our{" "}
            <a
              href="#"
              className="text-[#9B2C62] dark:text-[#F59E0B] hover:underline"
            >
              documentation
            </a>{" "}
            or{" "}
            <a
              href="#"
              className="text-[#9B2C62] dark:text-[#F59E0B] hover:underline"
            >
              contact support
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Dashboards;
