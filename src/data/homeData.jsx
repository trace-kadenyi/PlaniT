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

// quick step guide data
export const quickStepGuide = [
  {
    step: 1,
    title: "Add team members",
    description: "Invite your organization team and assign roles with appropriate permissions."
  },
  {
    step: 2,
    title: "Create an event",
    description: "Start by creating your first event with budget, timeline, and other details."
  },
  {
    step: 3,
    title: "Create & assign tasks",
    description: "Break down events into manageable tasks and assign them to team members."
  },
  {
    step: 4,
    title: "Add expenses",
    description: "Track event expenses with receipts and budget allocations."
  },
  {
    step: 5,
    title: "Add clients",
    description: "Create client profiles and assign them to relevant events."
  },
  {
    step: 6,
    title: "Add vendors",
    description: "Create vendor contacts and assign them to event expenses."
  },
]
