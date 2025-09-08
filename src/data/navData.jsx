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
} from "lucide-react";

// navlinks
export const navLinks = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  {
    icon: Calendar,
    label: "Events Manager",
    path: "/events",
    children: [
      { icon: CalendarBoard, label: "Events Board", path: "/events/board" },
      { icon: TasksBoard, label: "Tasks Board", path: "/tasks/board" },
    ],
  },
  { icon: Users, label: "Client Directory", path: "/clients" },
  { icon: UserCog, label: "Vendor Directory", path: "/vendors" },
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
