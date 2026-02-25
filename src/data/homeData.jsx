import {
  LayoutDashboard,
  CalendarCheck,
  Target,
  CheckSquare,
  Group,
} from "lucide-react";

// features sect data
export const features = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description: "View insights and analytics",
    color: "from-[#8B5CF6] to-[#7C3AED]",
    link: "/dashboards",
  },
  {
    icon: CalendarCheck,
    title: "Event Management",
    description: "Create and manage multiple events with ease",
    color: "from-[#9B2C62] to-[#9B2C62]/80",
    link: "/events/board",
  },
  {
    icon: Target,
    title: "Task Tracking",
    description: "Kanban boards for seamless task organization",
    color: "from-[#F59E0B] to-[#F97316]",
    link: "/tasks/board",
  },

  {
    icon: Group,
    title: "Team Collaboration",
    description: "Invite team members and assign roles",
    color: "from-[#3B82F6] to-[#2563EB]",
    link: "/team",
  },
];

// quick access data
export const quickAccess = [
  {
    to: "/dashboards",
    icon: LayoutDashboard,
    label: "Dashboard",
    sub: "View insights",
    accent: "#9B2C62",
  },
  {
    to: "/events/board",
    icon: CalendarCheck,
    label: "Events",
    sub: "Manage all events",
    accent: "#B83280",
  },
  {
    to: "/tasks/board",
    icon: CheckSquare,
    label: "Tasks",
    sub: "Kanban board",
    accent: "#F59E0B",
  },
  {
    to: "/team",
    icon: Group,
    label: "Team",
    sub: "Manage members",
    accent: "#D97706",
  },
];

// quick step guide data
export const quickStepGuide = [
  {
    step: 1,
    title: "Add team members",
    description:
      "Invite your organization team and assign roles with appropriate permissions.",
  },
  {
    step: 2,
    title: "Create an event",
    description:
      "Start by creating your first event with budget, timeline, and other details.",
  },
  {
    step: 3,
    title: "Create & assign tasks",
    description:
      "Break down events into manageable tasks and assign them to team members.",
  },
  {
    step: 4,
    title: "Add expenses",
    description: "Track event expenses with receipts and budget allocations.",
  },
  {
    step: 5,
    title: "Add clients",
    description: "Create client profiles and assign them to relevant events.",
  },
  {
    step: 6,
    title: "Add vendors",
    description: "Create vendor contacts and assign them to event expenses.",
  },
];
