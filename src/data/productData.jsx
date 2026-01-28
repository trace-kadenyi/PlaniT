import {
  ShieldCheck,
  Calendar,
  ClipboardList,
  CreditCard,
  History,
  Zap,
} from "lucide-react";

export const productFeatures = [
  {
    id: "demo",
    title: "Demo Access",
    icon: <Zap className="w-6 h-6 text-white dark:text-gray-300" />,
    description: "Generate demo credentials instantly - no email required",
    color: "from-[#F59E0B] to-[#F97316]",
    details: [
      "No email verification required",
      "Fake or disposable emails allowed",
      "Immediate access to all features",
    ],
  },
  {
    id: "events",
    title: "Events Management",
    icon: <Calendar className="w-6 h-6 text-white dark:text-gray-300" />,
    description: "Comprehensive event planning with Kanban-style dashboard",
    color: "from-[#9B2C62] to-[#7B1E5A]",
    details: [
      "Events as central planning units",
      "Drag-and-drop status updates",
      "Visual dashboard with event details",
    ],
  },
  {
    id: "tasks",
    title: "Tasks Dashboard",
    icon: <ClipboardList className="w-6 h-6 text-white dark:text-gray-300" />,
    description: "Task management with interactive Kanban board",
    color: "from-[#D97706] to-[#B45309]",
    details: [
      "Task tracking tied to events",
      "Real-time status updates",
      "Detailed task management",
    ],
  },
  {
    id: "roles",
    title: "Role-Based Access",
    icon: <ShieldCheck className="w-6 h-6 text-white dark:text-gray-300" />,
    description: "4-tier permission system with strict separation",
    color: "from-[#7C3AED] to-[#6D28D9]",
    details: [
      "Super Admin, Admin, Planner, Viewer",
      "No self-role modification",
      "Hierarchical permissions",
    ],
  },
  {
    id: "expenses",
    title: "Expense Control",
    icon: <CreditCard className="w-6 h-6 text-white dark:text-gray-300" />,
    description: "Secure expense handling with complete audit trails",
    color: "from-[#DC2626] to-[#B91C1C]",
    details: [
      "Role-restricted operations",
      "Paid expense deletion limited to Super Admin",
      "All actions logged",
    ],
  },
  {
    id: "audit",
    title: "Audit System",
    icon: <History className="w-6 h-6 text-white dark:text-gray-300" />,
    description: "Comprehensive logging for transparency and accountability",
    color: "from-[#059669] to-[#047857]",
    details: ["Expense audit logs", "User update history", "Action tracking"],
  },
];
