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
export function UserProfile({ collapsed, User, LogOut, onLogout, user, Link }) {
  return (
    <div
      className={`p-3 border-t ${collapsed ? "px-2" : "px-4"} dark:bg-gray-800`}
    >
      <div
        className={`flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        <Link
          to={`users/${user._id}`}
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
              <p className="text-sm dark:text-gray-200 font-medium group-hover:text-[#FF9933] transition-colors">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-[#FFB866] transition-colors">
                {user?.role || "undefined role"}
              </p>
            </div>
          )}
        </Link>
        {!collapsed && (
          <button
            onClick={onLogout}
            className="p-1 rounded-full hover:bg-[#FFB866]/10 text-gray-500 dark:text-gray-400 hover:text-[#E07C24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB866] transition-colors"
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
    <div className="mt-8 border-t border-[#9B2C62]/20 pt-4 mr-2">
      {navLinks.slice(5).map((item) => {
        // theme toggle
        if (item.isThemeToggle) {
          return (
            <button
              key="theme-toggle"
              onClick={toggleTheme}
              className={`
                flex items-center p-2 m-1 rounded-lg transition-all duration-300 w-full
                ${
                  theme === "light"
                    ? "bg-[#FF9933]/20 hover:bg-[#FF9933]/30 text-[#E07C24] border-r-2 border-[#FF9933]"
                    : "bg-[#9B2C62]/20 hover:bg-[#9B2C62]/50 text-[#BE3455] hover:text-gray-400 border-r-2 border-[#9B2C62]"
                }
                ${collapsed ? "justify-center" : "gap-3"}
                hover:opacity-90
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933]
              `}
              title={
                collapsed
                  ? theme === "light"
                    ? "Dark Mode"
                    : "Light Mode"
                  : undefined
              }
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon size={18} className="text-[#E07C24]" />
              ) : (
                <Sun size={18} className="text-[#BE3455]" />
              )}

              {!collapsed && (
                <span className="text-sm font-medium">
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </span>
              )}
            </button>
          );
        }

        // NORMAL SECONDARY LINKS (unchanged)
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center p-2 m-1 rounded-lg transition-all duration-300 w-full
              ${
                isActive(item.path)
                  ? "bg-[#9B2C62]/10 text-[#9B2C62] border-r-4 border-[#9B2C62] font-medium dark:bg-[#9B2C62]/30 dark:text-[#E07C24]"
                  : "text-gray-500 dark:text-gray-400 hover:bg-[#FF9933]/10 hover:text-[#E07C24] dark:hover:bg-[#9B2C62]/10 dark:hover:text-gray-400"
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
                  ? "text-[#9B2C62] dark:text-[#BE3455]"
                  : "text-[#9B2C62]/70 dark:text-[#BE3455] group-hover:text-[#E07C24]"
              }
              aria-hidden="true"
            />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </Link>
        );
      })}
    </div>
  );
}
