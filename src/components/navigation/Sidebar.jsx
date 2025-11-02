import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ChevronLeft,
  Menu,
  X,
  User,
  LogOut,
  Sun,
  Moon,
  UsersIcon,
} from "lucide-react";

import { logout, logoutUser } from "../../redux/authSlice";
import { navLinks } from "../../data/navData";
import { BarLogo, UserProfile, SecondaryLinks } from "../ui/Bar";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // GET USER FROM REDUX STORE
  const { user } = useSelector((state) => state.auth);

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

  // Handle theme change
  useEffect(() => {
    // Update localStorage
    localStorage.setItem("theme", theme);

    // Update HTML class
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.log("Logout error:", error);
        // Still redirect to login even if API call fails
        navigate("/login");
      });
  };

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
      // Set timeout to match the transition duration (500ms in this case)
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
          className={`h-full bg-white border-r border-[#9B2C62] shadow-sm flex flex-col transition-all duration-500 ease-in-out overflow-y-auto hide-scrollbar ${
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
          <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1 hide-scrollbar dark:bg-gray-800">
            {navLinks.slice(0, 4).map((item) => (
              <div key={item.path}>
                <Link
                  to={item.path}
                  className={`
        flex items-center p-3 rounded-lg transition-colors
        ${
          isActive(item.path)
            ? "bg-[#9B2C62] text-white dark:text-gray-200"
            : "hover:bg-[#FFB866]/20 dark:hover:bg-[#9B2C62]/30 text-gray-700 dark:text-gray-300"
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
                        ? "text-white dark:text-gray-100"
                        : "text-[#9B2C62] dark:text-[#D97706] group-hover:text-[#FF9933]"
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
              ? "bg-[#FFF5EB] dark:bg-[#D97706]/30 border-l-4 border-[#FF9933] text-[#E07C24]"
              : "hover:bg-[#FFF5EB]/50 dark:hover:bg-[#F59E0B]/20  text-gray-600 dark:text-gray-400 hover:text-[#9B2C62] dark:hover:text-[#F59E0B]"
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
                              : "text-[#9B2C62] dark:text-[#D97706] group-hover:text-[#FF9933]"
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
                  ? "bg-[#FFF5EB] dark:bg-[#D97706]/30 text-[#E07C24]"
                  : "hover:bg-[#FFF5EB]/50 dark:hover:bg-[#F59E0B]/20 text-gray-600 hover:text-[#9B2C62] dark:hover:text-[#F59E0B]"
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
                              ? "text-[#E07C24] dark:text-[#F59E0B]"
                              : "text-[#9B2C62]/70 dark:text-[#F59E0B] group-hover:text-[#FF9933]"
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
              bg-[#FF9933] dark:bg-[#E07C24] text-white
              hover:bg-[#E07C24] dark:hover:bg-[#FF9933] ${
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

            {/* user management */}
            <div>
              <Link
                to="/team"
                className="flex items-center space-x-2 text-gray-700 hover:text-[#9B2C62]"
              >
                <UsersIcon className="w-5 h-5" />
                <span>Team</span>
              </Link>
            </div>

            {/* Secondary Links */}
            <SecondaryLinks
              navLinks={navLinks}
              Link={Link}
              isActive={isActive}
              collapsed={collapsed}
              toggleTheme={toggleTheme}
              Moon={Moon}
              Sun={Sun}
              theme={theme}
            />
          </nav>

          {/* User Profile */}
          <UserProfile
            collapsed={collapsed}
            User={User}
            LogOut={LogOut}
            Link={Link}
            user={user}
            onLogout={handleLogout}
          />
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
