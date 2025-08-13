import LogoWordmark from "../navigation/LogoWordmark";

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
