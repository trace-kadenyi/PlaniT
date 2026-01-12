// Action type filter
export function ActionTypeFilter({
  setFilterActionType,
  filterActionType,
  getActionIcon,
  getActionLabel,
  actionTypeCounts,
}) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {["ALL", "DELETE", "UPDATE", "AMOUNT_CHANGE", "STATUS_CHANGE"].map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilterActionType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
                filterActionType === type
                  ? "bg-[#9B2C62] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              {getActionIcon(type)}
              <span>{getActionLabel(type)}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-xs ${
                  filterActionType === type
                    ? "bg-white/20"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {actionTypeCounts[type] || 0}
              </span>
            </button>
          )
        )}
      </div>
    </div>
  );
}
