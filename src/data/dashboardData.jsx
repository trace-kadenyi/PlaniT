export const createDashboardCards = ({
  CalendarRange,
  activeUpcomingEventsCount,
  CheckSquare,
  pendingTasks,
  totalTasks,
  BarChart3,
  totalBudget,
}) => {
  return [
    {
      id: "events",
      title: "Events Board",
      description:
        "Track and manage all your events. Drag and drop to update status in real-time.",
      icon: CalendarRange,
      color: "bg-gradient-to-br from-[#9B2C62] to-[#801f4f]",
      iconColor: "text-white",
      path: "/events/board",
      stats: "Active events",
      statValue: activeUpcomingEventsCount.toString(),
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
      path: "/tasks/board",
      stats: "Pending tasks",
      statValue: pendingTasks.toString(),
      features: ["Kanban Boards", "Assignments", "Deadlines"],
      enabled: totalTasks > 0,
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
};
