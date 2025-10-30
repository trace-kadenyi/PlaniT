import { ClipboardList, LayoutDashboard, User, BarChart4 } from "lucide-react";

// features sect data
export const features = [
  {
    title: "Task Management",
    desc: "Create, assign, and track tasks with deadlines and priorities.",
  },
  {
    title: "Event Dashboard",
    desc: "Get a clear overview of each event with statuses and progress stats.",
  },
  {
    title: "Client Details",
    desc: "Store client preferences, notes, and view their event history.",
  },
  {
    title: "Budgeting Tools",
    desc: "Add expenses, categorize costs, and track remaining budgets.",
  },
  {
    title: "Vendor & Resource Management (Coming Soon)",
    desc: "Manage caterers, venues, and suppliers in one place.",
  },
  {
    title: "Calendar & Scheduling (Coming Soon)",
    desc: "View deadlines and sync events to Google Calendar.",
  },
];

// process sect data
export const steps = [
  {
    Icon: User,
    title: "1. Create a Client",
    text: "Add client details so you always know who the event is for.",
  },
  {
    Icon: LayoutDashboard,
    title: "2. Add an Event",
    text: "Set event dates, status, and link it to your client.",
  },
  {
    Icon: ClipboardList,
    title: "3. Plan Tasks",
    text: "Break down the event into actionable tasks and assign them.",
  },
  {
    Icon: BarChart4,
    title: "4. Track Progress",
    text: "Monitor task completion, budgets, and overall event status.",
  },
];
