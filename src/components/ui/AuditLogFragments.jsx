import {
  History,
  FileText,
  Calendar,
  User,
  DollarSign,
  ChevronDown,
  Shield,
  Receipt,
  RefreshCw,
  CirclePlus,
  Shapes,
} from "lucide-react";

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

// log section collapsed
export function CollapsedLog({ auditLogCount, eventId, setIsExpanded }) {
  return (
    <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-8 border border-[#F3EDE9] dark:border-gray-700 text-center">
      <div className="mx-auto max-w-sm flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 flex items-center justify-center mb-4">
          <Shield className="w-6 h-6 text-[#F59E0B]" />
        </div>
        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
          Expense Audit Log
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          {auditLogCount} audit record{auditLogCount !== 1 ? "s" : ""} recorded
          {eventId && " for this event"}
        </p>
        <button
          onClick={() => setIsExpanded(true)}
          className="inline-flex items-center gap-2 bg-[#9B2C62] hover:bg-[#801f4f] text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
        >
          View Audit Log
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// no filtered logs
export function NoFilteredLogs({ filterActionType, getActionLabel }) {
  return (
    <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-8 border border-[#F3EDE9] dark:border-gray-700 text-center">
      <div className="mx-auto max-w-sm flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 flex items-center justify-center mb-4">
          <Receipt className="w-6 h-6 text-[#F59E0B]" />
        </div>
        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
          No audit records
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {filterActionType === "ALL"
            ? "No expense changes recorded yet"
            : `No ${getActionLabel(
                filterActionType
              ).toLowerCase()} records found`}
        </p>
      </div>
    </div>
  );
}
