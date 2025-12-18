function QuickStats({ stat, index, totalExpenses, pendingTasks }) {
  return (
    <div
      key={index}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-[#F3EDE9] shadow-sm hover:shadow-md transition-shadow bg-[#FFF9F5] border border-gray-200 p-3 rounded-md shadow-xs hover:shadow-md dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)]"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {stat.label}
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
            {stat.value}
          </p>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full mt-2 inline-block ${
              (stat.label === "Total Budget" && totalExpenses === 0) ||
              (stat.label === "Pending Tasks" && pendingTasks === 0)
                ? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
            }`}
          >
            {stat.change}
          </span>
        </div>
        <div className={`p-3 rounded-full ${stat.color}`}>
          <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
        </div>
      </div>
    </div>
  );
}

export default QuickStats;
