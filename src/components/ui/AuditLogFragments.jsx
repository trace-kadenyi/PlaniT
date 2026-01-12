import { User, ChevronDown, Shield, Receipt } from "lucide-react";

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

// audit logs intro section
export function AuditLogsIntro({
  getActionIcon,
  log,
  getActionColor,
  getActionLabel,
  getCategoryColor,
  formatCurrency,
  formatDateTimeShort,
}) {
  return (
    <div className="flex items-start justify-between mb-2 flex-col sm:flex-row gap-3">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-[#9B2C62]/10 dark:bg-[#9B2C62]/20">
          {getActionIcon(log.actionType)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getActionColor(
                log.actionType
              )}`}
            >
              {getActionLabel(log.actionType)}
            </span>
            {log.expenseData?.paymentStatus === "paid" && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Paid
              </span>
            )}
          </div>
          <p className="font-medium text-gray-800 dark:text-white text-sm mt-1">
            {log.expenseData?.description || "Expense modified"}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                log.expenseData?.category
              )}`}
            >
              {log.expenseData?.category || "other"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatCurrency(log.expenseData?.amount || 0)}
            </span>
          </div>
        </div>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-auto sm:ml-0">
        {formatDateTimeShort(log.deletedAt || log.createdAt)}
      </span>
    </div>
  );
}

// Audit Overview - modified by/changed fields
export function AuditLogsOverview({ log, formatYearMonthDay }) {
  const enforcer = log.deletedBy ?? log.performedBySnapshot ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <User className="w-3 h-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {" "}
              Modified by:
            </span>
            <span className="font-medium text-gray-500 dark:text-gray-300">
              {enforcer
                ? `${enforcer.firstName} ${enforcer.lastName}`
                : "Unknown"}
            </span>

            {enforcer?.role && (
              <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
                {enforcer.role}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {/* Show changes for UPDATE actions */}
        {log.changes && log.changes.length > 0 && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Changed fields:
            </p>
            <div className="flex flex-wrap gap-1">
              {log.changes.map((change, idx) => {
                let displayText = `${change.field}: `;

                if (change.field === "vendor") {
                  // For vendor, show just "Vendor changed" or vendor names
                  displayText = "Vendor changed";
                } else if (
                  change.field === "dueDate" ||
                  change.field === "paymentDate"
                ) {
                  // Format dates
                  const formatDate = (dateStr) =>
                    dateStr ? formatYearMonthDay(dateStr) : "None";
                  displayText = `${change.field}: ${formatDate(
                    change.oldValue
                  )} → ${formatYearMonthDay(change.newValue)}`;
                } else {
                  displayText = `${change.field}: ${
                    change.oldValue || "None"
                  } → ${change.newValue || "None"}`;
                }

                return (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-[#9B2C62]/10 dark:bg-[#F59E0B]/10 text-[#9B2C62] dark:text-[#F59E0B] rounded text-xs font-medium"
                  >
                    {displayText}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
