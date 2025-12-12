import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  FileText,
  HelpCircle,
  CalendarRange as CalendarBoard,
  ClipboardList as TasksBoard,
  UserCog,
  Sun,
  Group,
  Home,
} from "lucide-react";

// navlinks data
export const navLinks = [
  { icon: Home, label: "Home", path: "/" },
  {
    icon: Calendar,
    label: "Events Manager",
    path: "/events",
  },
  {
    icon: LayoutDashboard,
    label: "Dashboards",
    path: "/dashboards",
    children: [
      { icon: CalendarBoard, label: "Events Board", path: "/events/board" },
      { icon: TasksBoard, label: "Tasks Board", path: "/tasks/board" },
    ],
  },
  { icon: Users, label: "Client Directory", path: "/clients" },
  { icon: UserCog, label: "Vendor Directory", path: "/vendors" },
  { icon: Group, label: "Team", path: "/team" },

  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
    children: [
      {
        icon: Sun,
        label: "Theme",
        isThemeToggle: true,
      },
    ],
  },
  { icon: FileText, label: "Documents", path: "/documents" },
  { icon: HelpCircle, label: "Help", path: "/help" },
];
