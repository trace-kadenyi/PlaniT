import {
  CalendarRange,
  CheckSquare,
  BarChart3,
  CircleDollarSign,
  CalendarCheck2,
} from "lucide-react";

// quick stats
export const createQuickStats = ({
  totalEvents,
  activeUpcomingEventsCount,
  pendingTasks,
  completedTasks,
  totalExpenses,
  totalBudget,
}) => {
  return [
    {
      label: "Total Events",
      value: totalEvents.toString(),
      change: `+${activeUpcomingEventsCount} upcoming`,
      icon: CalendarRange,
      color: "bg-[#9B2C62]/10 dark:bg-[#9B2C62]/20",
      textColor: "text-[#9B2C62] dark:text-[#F59E0B]",
    },
    {
      label: "Completed Events",
      value: (totalEvents - activeUpcomingEventsCount).toString(),
      change: `+${activeUpcomingEventsCount} pending`,
      icon: CalendarCheck2,
      color: "bg-[#9B2C62]/10 dark:bg-[#9B2C62]/20",
      textColor: "text-[#9B2C62] dark:text-[#F59E0B]",
    },
    {
      label: "Pending Tasks",
      value: pendingTasks.toString(),
      change: `${completedTasks} completed`,
      icon: CheckSquare,
      color: "bg-[#9B2C62]/10 dark:bg-[#9B2C62]/20",
      textColor: "text-[#9B2C62] dark:text-[#F59E0B]",
    },
    {
      label: "Total Budget",
      value: totalBudget > 0 ? `$${(totalBudget / 1000).toFixed(0)}k` : "$0",
      change:
        totalExpenses > 0
          ? `-$${totalExpenses.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : "No spending",
      icon: CircleDollarSign,
      color: "bg-[#801f4f]/10 dark:bg-[#801f4f]/20",
      textColor: "text-[#801f4f] dark:text-[#F59E0B]",
    },
  ];
};

// dashboard cards
export const createDashboardCards = ({
  activeUpcomingEventsCount,
  pendingTasks,
  totalTasks,
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
