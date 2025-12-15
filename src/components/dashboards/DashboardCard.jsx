import { TrendingUp } from "lucide-react";

function DashboardCard({ dashboard, navigate }) {
  return (
    <div
      key={dashboard.id}
      className="group relative bg-gradient-to-br from-white to-[#FFF8F2] dark:from-gray-800/80 dark:to-gray-900/80 rounded-2xl border border-[#F3EDE9] dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
      onClick={() =>
        dashboard.path &&
        dashboard.id !== "analytics" &&
        navigate(dashboard.path)
      }
    >
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity">
        <div
          className={`${dashboard.color} w-full h-full rounded-bl-full`}
        ></div>
      </div>

      <div className="p-6">
        {/* Icon Header */}
        <div className="flex items-center justify-between mb-6">
          <div className={`p-4 rounded-xl ${dashboard.color}`}>
            <dashboard.icon className={`w-8 h-8 ${dashboard.iconColor}`} />
          </div>
          {dashboard.statValue && (
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-800 dark:text-white">
                {dashboard.statValue}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {dashboard.stats}
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
          {dashboard.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {dashboard.description}
        </p>

        {/* Features */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {dashboard.features.map((feature, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full border border-[#F3EDE9] dark:border-gray-600"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            dashboard.path && navigate(dashboard.path);
          }}
          className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            dashboard.id === "analytics"
              ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
              : `${dashboard.color
                  .split(" ")[0]
                  .replace(
                    "bg-gradient-to-br",
                    "bg"
                  )} text-black dark:text-white hover:opacity-90 hover:bg-[#9B2C62]/5 dark:hover:bg-gray-700/30`
          }`}
          disabled={dashboard.id === "analytics"}
        >
          {dashboard.id === "analytics" ? "Coming Soon" : "Open Dashboard"}
          <TrendingUp className="w-4 h-4" />
        </button>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#9B2C62]/20 dark:group-hover:border-[#F59E0B]/20 rounded-2xl transition-all duration-300 pointer-events-none"></div>
    </div>
  );
}

export default DashboardCard;
