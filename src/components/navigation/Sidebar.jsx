import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Menu,
  X,
  User,
  LogOut
} from 'lucide-react';

export default function Sidebar () {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile sidebar on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mainLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: Users, label: 'Clients', path: '/clients' },
    { icon: ClipboardList, label: 'Tasks', path: '/tasks' },
  ];

  const secondaryLinks = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: FileText, label: 'Documents', path: '/documents' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
  ];

  const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed z-30 p-2 m-2 rounded-lg bg-[#9B2C62] text-white md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-20 h-screen bg-white border-r shadow-sm
          transition-all duration-300
          ${collapsed ? 'w-16' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Branding & Collapse */}
        <div className={`flex items-center p-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#9B2C62] flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="font-bold text-[#9B2C62]">Planit</span>
            </Link>
          )}
          {collapsed && (
            <Link to="/" className="flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#9B2C62] flex items-center justify-center text-white font-bold">
                P
              </div>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1 rounded-full hover:bg-[#9B2C62]/10 text-[#9B2C62] ${collapsed ? 'hidden' : 'block'}`}
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="mt-4 px-2 space-y-1">
          {mainLinks.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={`
                flex items-center p-3 rounded-lg transition-colors
                ${isActive(path) ? 'bg-[#9B2C62] text-white' : 'hover:bg-[#9B2C62]/10 text-gray-700'}
                ${collapsed ? 'justify-center' : 'gap-3'}
              `}
              title={collapsed ? label : undefined}
            >
              <Icon size={20} className={isActive(path) ? 'text-white' : 'text-[#9B2C62]'} />
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}

          {/* Create Event Button */}
          <div className={`pt-2 ${collapsed ? 'px-1' : 'px-2'}`}>
            <Link
              to="/events/create"
              className={`
                flex items-center p-3 rounded-lg transition-colors bg-[#9B2C62] text-white
                hover:bg-[#9B2C62]/90 ${collapsed ? 'justify-center' : 'gap-3 justify-center'}
              `}
              title={collapsed ? 'Create Event' : undefined}
            >
              <Plus size={20} />
              {!collapsed && <span>Create Event</span>}
            </Link>
          </div>
        </nav>

        {/* Secondary Navigation */}
        <div className="mt-8 px-2 space-y-1">
          {secondaryLinks.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={`
                flex items-center p-3 rounded-lg transition-colors
                ${isActive(path) ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50 text-gray-500'}
                ${collapsed ? 'justify-center' : 'gap-3'}
              `}
              title={collapsed ? label : undefined}
            >
              <Icon size={20} />
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}
        </div>

        {/* User Profile */}
        <div className={`absolute bottom-0 w-full p-3 border-t ${collapsed ? 'px-2' : 'px-4'}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={16} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
            )}
            {collapsed && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={16} className="text-gray-600" />
              </div>
            )}
            {!collapsed && (
              <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
};