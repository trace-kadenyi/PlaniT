import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, ChevronLeft, Menu, X, User, LogOut } from "lucide-react";

import LogoWordmark from "./LogoWordmark";
import { navLinks } from "../../data/navData";
import { BarLogo } from "../ui/Bar";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const { pathname } = useLocation();

  // Close mobile sidebar when route changes or on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // isactive
  const isActive = (path) => {
    if (path === "/") return pathname === path;
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // toggle sidebar
  const toggleSidebar = () => {
    if (!collapsed) {
      // Immediately collapse
      setCollapsed(true);
    } else {
      // Start expanding
      setIsExpanding(true);
      setCollapsed(false);
      // Set timeout to match your transition duration (500ms in your case)
      setTimeout(() => setIsExpanding(false), 500);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        aria-label="Toggle sidebar"
        className="fixed z-300 p-2 m-2 rounded-lg bg-[#9B2C62] text-white md:hidden hover:bg-[#7A2450] transition-colors"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-200 md:relative md:block ${
          mobileOpen ? "block" : "hidden"
        }`}
      >
        <aside
          className={`h-full bg-white border-r border-[#9B2C62] shadow-sm flex flex-col transition-all duration-500 ease-in-out ${
            collapsed ? "w-16" : "w-64"
          }`}
          aria-label="Sidebar"
        >
          {/* Branding & Collapse */}
          <div
            className={`absolute -right-3 top-1/2 transform -translate-y-1/2 z-100 ${
              collapsed ? "rotate-180" : ""
            }`}
          >
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full bg-white border shadow-md hover:bg-[#FFF5EB] focus:outline-none focus:ring-2 focus:ring-[#9B2C62] hover:text-[#FF9933] transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft
                size={20}
                className="text-[#9B2C62] hover:text-[#FF9933]"
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Logo */}
          <BarLogo
            collapsed={collapsed}
            Link={Link}
            isExpanding={isExpanding}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            X={X}
          />

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
            {navLinks.slice(0, 4).map((item) => (
              <div key={item.path}>
                <Link
                  to={item.path}
                  className={`
        flex items-center p-3 rounded-lg transition-colors
        ${
          isActive(item.path)
            ? "bg-[#9B2C62] text-white"
            : "hover:bg-[#FFB866]/20 text-gray-700"
        }
        ${collapsed ? "justify-center" : "gap-3"}
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933]
      `}
                  title={collapsed ? item.label : undefined}
                  aria-current={isActive(item.path) ? "page" : undefined}
                >
                  <item.icon
                    size={20}
                    className={
                      isActive(item.path)
                        ? "text-white"
                        : "text-[#9B2C62] group-hover:text-[#FF9933]"
                    }
                    aria-hidden="true"
                  />
                  {!collapsed && <span>{item.label}</span>}
                </Link>

                {/* Expanded state children */}
                {!collapsed && item.children && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`
          flex items-center p-2 pl-3 rounded-lg transition-colors
          ${
            isActive(child.path)
              ? "bg-[#FFF5EB] border-l-4 border-[#FF9933] text-[#E07C24]"
              : "hover:bg-[#FFF5EB]/50 text-gray-600 hover:text-[#9B2C62]"
          }
          gap-3
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB866]
        `}
                        aria-current={isActive(child.path) ? "page" : undefined}
                      >
                        <child.icon
                          size={18}
                          className={
                            isActive(child.path)
                              ? "text-[#E07C24]"
                              : "text-[#9B2C62]/70 group-hover:text-[#FF9933]"
                          }
                          aria-hidden="true"
                        />
                        <span className="text-sm font-medium">
                          {child.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
                {/* Collapsed state children */}
                {collapsed && item.children && (
                  <div className="mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`
              flex items-center justify-center p-2 rounded-lg transition-colors
              ${
                isActive(child.path)
                  ? "bg-[#FFF5EB] text-[#E07C24]"
                  : "hover:bg-[#FFF5EB]/50 text-gray-600 hover:text-[#9B2C62]"
              }
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB866]
            `}
                        title={child.label}
                        aria-current={isActive(child.path) ? "page" : undefined}
                      >
                        <child.icon
                          size={18}
                          className={
                            isActive(child.path)
                              ? "text-[#E07C24]"
                              : "text-[#9B2C62]/70 group-hover:text-[#FF9933]"
                          }
                          aria-hidden="true"
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Create Event Button */}
            <div className={`pt-2 ${collapsed ? "px-1" : "px-2"}`}>
              <Link
                to="/events/new"
                className={`
              flex items-center p-3 rounded-lg transition-colors 
              bg-[#FF9933] text-white
              hover:bg-[#E07C24] ${
                collapsed ? "justify-center" : "gap-3 justify-center"
              }
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB866]
            `}
                title={collapsed ? "Create Event" : undefined}
              >
                <Plus size={20} aria-hidden="true" />
                {!collapsed && <span>Create Event</span>}
              </Link>
            </div>

            {/* Secondary Links */}
            <div className="mt-8">
              {navLinks.slice(4).map(({ icon: Icon, label, path }) => (
                <Link
                  key={path}
                  to={path}
                  className={`
                    flex items-center p-3 rounded-lg transition-colors
                    ${
                      isActive(path)
                        ? "bg-[#FFB866]/30 text-[#E07C24]"
                        : "hover:bg-[#FFB866]/10 text-gray-500 hover:text-[#FF9933]"
                    }
                    ${collapsed ? "justify-center" : "gap-3"}
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB866]
                  `}
                  title={collapsed ? label : undefined}
                  aria-current={isActive(path) ? "page" : undefined}
                >
                  <Icon
                    size={20}
                    className={isActive(path) ? "text-[#E07C24]" : ""}
                    aria-hidden="true"
                  />
                  {!collapsed && <span>{label}</span>}
                </Link>
              ))}
            </div>
          </nav>

          {/* User Profile */}
          <div className={`p-3 border-t ${collapsed ? "px-2" : "px-4"}`}>
            <div
              className={`flex items-center ${
                collapsed ? "justify-center" : "justify-between"
              }`}
            >
              <Link
                to="/profile"
                className="flex items-center gap-2 focus-visible:outline-none group"
                title={collapsed ? "Profile" : undefined}
              >
                <div className="w-8 h-8 rounded-full bg-[#FFB866]/30 flex items-center justify-center group-hover:bg-[#FF9933]/40 transition-colors">
                  <User
                    size={16}
                    className="text-[#E07C24] group-hover:text-[#FF9933]"
                    aria-hidden="true"
                  />
                </div>
                {!collapsed && (
                  <div>
                    <p className="text-sm font-medium group-hover:text-[#FF9933] transition-colors">
                      John Doe
                    </p>
                    <p className="text-xs text-gray-500 group-hover:text-[#FFB866] transition-colors">
                      Admin
                    </p>
                  </div>
                )}
              </Link>
              {!collapsed && (
                <button
                  className="p-1 rounded-full hover:bg-[#FFB866]/10 text-gray-500 hover:text-[#E07C24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB866] transition-colors"
                  aria-label="Logout"
                >
                  <LogOut size={18} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-100 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          role="presentation"
        />
      )}
    </>
  );
}
