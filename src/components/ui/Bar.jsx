import LogoWordmark from "../navigation/LogoWordmark";

// sidebar logo
export function BarLogo({
  collapsed,
  Link,
  isExpanding,
  mobileOpen,
  setMobileOpen,
  X,
}) {
  return (
    <div
      className={`flex items-center bg-[#9B2C62] p-4 ${
        collapsed ? "justify-center" : "justify-center"
      }`}
    >
      <Link to="/" className="focus-visible:outline-none group relative">
        {/* Initial 'P' logo that fades out */}
        {(collapsed || isExpanding) && (
          <div
            className={`w-8 h-8 rounded-full bg-[#FF9933] flex items-center justify-center text-white font-bold group-hover:bg-[#FF9933] transition-all duration-300 ${
              collapsed && !isExpanding ? "opacity-100" : "opacity-0"
            }`}
          >
            P
          </div>
        )}

        {/* Full wordmark that fades in */}
        {(!collapsed || isExpanding) && (
          <div
            className={`h-8 flex items-center transition-all duration-300 ${
              !collapsed && !isExpanding ? "opacity-100" : "opacity-0 absolute"
            }`}
            style={{ left: collapsed ? "-100%" : "0" }}
          >
            <LogoWordmark />
          </div>
        )}
      </Link>

      {/* Mobile Close Button (Top-left) */}
      {mobileOpen && (
        <button
          className="md:hidden p-1 absolute left-2 text-white hover:text-[#FFB866] transition-colors"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>
      )}
    </div>
  );
}

// sidebar user profile
export function UserProfile({ collapsed, User, LogOut, Link }) {
  return (
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
  );
}

// secondary links
export function SecondaryLinks({
  navLinks,
  Link,
  isActive,
  collapsed,
  toggleTheme,
  Moon,
  Sun,
  theme,
}) {
  return (
    <div className="mt-8 border-t border-[#9B2C62]/20 pt-4">
      {navLinks.slice(4).map((item) => (
        <div key={item.path}>
          <Link
            to={item.path}
            className={`
                      flex items-center p-3 rounded-lg transition-all duration-300
                      ${
                        isActive(item.path)
                          ? "bg-[#9B2C62]/10 text-[#9B2C62] border-r-4 border-[#9B2C62] font-medium"
                          : "text-gray-500 hover:bg-[#FF9933]/10 hover:text-[#E07C24]"
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
                  ? "text-[#9B2C62]"
                  : "text-[#9B2C62]/70 group-hover:text-[#E07C24]"
              }
              aria-hidden="true"
            />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </Link>

          {/* Settings children (Theme toggle) */}
          {!collapsed && item.children && item.label === "Settings" && (
            <div className="ml-8 mt-1 space-y-1">
              {item.children.map((child) => (
                <div key={child.label}>
                  {child.isThemeToggle ? (
                    // Theme toggle button
                    <button
                      onClick={toggleTheme}
                      className={`
                                flex items-center p-2 pl-3 rounded-lg transition-all duration-300 w-full
                                ${
                                  theme === "light"
                                    ? "bg-[#FF9933]/20 text-[#E07C24] border-r-2 border-[#FF9933]"
                                    : "bg-[#9B2C62]/20 text-[#9B2C62] border-r-2 border-[#9B2C62]"
                                }
                                hover:opacity-90
                                gap-3
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933]
                              `}
                      aria-label="Toggle theme"
                    >
                      {theme === "light" ? (
                        <Moon size={18} className="text-[#E07C24]" />
                      ) : (
                        <Sun size={18} className="text-[#9B2C62]" />
                      )}
                      <span className="text-sm font-medium">
                        {theme === "light" ? "Dark Mode" : "Light Mode"}
                      </span>
                    </button>
                  ) : (
                    // Regular settings child
                    <Link
                      to={child.path || "#"}
                      className={`
                                flex items-center p-2 pl-3 rounded-lg transition-all duration-300
                                ${
                                  isActive(child.path)
                                    ? "bg-[#9B2C62]/10 text-[#9B2C62] border-r-4 border-[#9B2C62] font-medium"
                                    : "hover:bg-[#FF9933]/10 text-[#7A2450] hover:text-[#E07C24]"
                                }
                                gap-3
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933]
                              `}
                      aria-current={isActive(child.path) ? "page" : undefined}
                    >
                      <child.icon
                        size={18}
                        className={
                          isActive(child.path)
                            ? "text-[#9B2C62]"
                            : "text-[#9B2C62]/70 group-hover:text-[#E07C24]"
                        }
                        aria-hidden="true"
                      />
                      <span className="text-sm font-medium">{child.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
