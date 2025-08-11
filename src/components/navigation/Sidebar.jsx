import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  ClipboardList,
  Plus,
  ChevronLeft,
  ChevronRight,
  Settings,
  FileText,
  HelpCircle,
} from "lucide-react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Check if current route is active
  const isActive = (path) => location.pathname.includes(path);

  const navItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      color: "text-[#F59E0B]",
    },
    {
      name: "Events",
      icon: Calendar,
      path: "/events",
      color: "text-[#F97316]",
    },
    {
      name: "Clients",
      icon: Users,
      path: "/clients",
      color: "text-[#9B2C62]",
    },
    {
      name: "Tasks",
      icon: ClipboardList,
      path: "/tasks",
      color: "text-[#F59E0B]",
    },
  ];

  const secondaryItems = [
    {
      name: "Documents",
      icon: FileText,
      path: "/documents",
      color: "text-gray-400",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
      color: "text-gray-400",
    },
    {
      name: "Help",
      icon: HelpCircle,
      path: "/help",
      color: "text-gray-400",
    },
  ];

  return (
    <aside
      className={`h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Collapse Toggle */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-full hover:bg-[#9B2C62]/10 text-[#9B2C62]"
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center p-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? "bg-[#9B2C62]/10 text-[#9B2C62] font-semibold"
                : "hover:bg-[#9B2C62]/5 text-gray-700"
            }`}
          >
            <item.icon className={`w-5 h-5 ${item.color}`} />
            {!isCollapsed && <span className="ml-3">{item.name}</span>}
          </Link>
        ))}

        {/* Create Event Button */}
        {!isCollapsed && (
          <div className="pt-6">
            <Link
              to="/events/create"
              className="flex items-center justify-center gap-2 p-3 bg-[#9B2C62] text-white rounded-lg hover:bg-[#9B2C62]/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create Event</span>
            </Link>
          </div>
        )}
        {isCollapsed && (
          <div className="pt-6 flex justify-center">
            <Link
              to="/events/create"
              className="flex items-center justify-center p-3 bg-[#9B2C62] text-white rounded-lg hover:bg-[#9B2C62]/90 transition-colors"
              title="Create Event"
            >
              <Plus className="w-5 h-5" />
            </Link>
          </div>
        )}
      </nav>

      {/* Secondary Navigation */}
      <div className="px-4 pb-6 space-y-2">
        {secondaryItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center p-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? "bg-gray-100 text-gray-900"
                : "hover:bg-gray-50 text-gray-500"
            }`}
          >
            <item.icon className={`w-5 h-5 ${item.color}`} />
            {!isCollapsed && <span className="ml-3">{item.name}</span>}
          </Link>
        ))}
      </div>
    </aside>
  );
}
