import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { History, User, ChevronDown, RefreshCw } from "lucide-react";

import { fetchExpenseAuditLogs } from "../../../redux/expensesSlice";

import {
  usePermissions,
  PERMISSIONS,
  RESOURCES,
} from "../../../globalHooks/userPermissions";
import { formatDateTimeShort } from "../utils/formatting";
import { formatYearMonthDay } from "../../../globalUtils/dateHelpers";
import {
  formatCurrency,
  getCategoryColor,
  getActionColor,
  getActionIcon,
  getActionLabel,
  getActionTypeCounts,
} from "../utils/auditLogHelpers";
import { useFilteredAuditLogs } from "../hooks/useExpenseAuditLogs";
import {
  ActionTypeFilter,
  CollapsedLog,
  NoFilteredLogs,
} from "../../ui/AuditLogFragments";
import { AuditLogsLoading } from "../../shared/LoadingStates";
import { AuditLogsErrorState } from "../../shared/ErrorStates";
import { ExpenseLogExpandables } from "./ExpenseLogExpandables";

const ExpenseAuditLogPanel = ({ eventId }) => {
  const dispatch = useDispatch();
  const { can, currentUser: authUser } = usePermissions();

  const {
    auditLogs,
    auditLogStatus,
    auditLogError,
    auditLogFilters,
    auditLogCount,
    paidExpensesCount,
  } = useSelector((state) => state.expenses);

  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [filterActionType, setFilterActionType] = useState("ALL");

  // fetch logs
  useEffect(() => {
    if (can(PERMISSIONS.VIEW_AUDIT_LOGS, RESOURCES.AUDIT_LOG)) {
      dispatch(
        fetchExpenseAuditLogs({
          eventId,
          filters: {
            ...auditLogFilters,
            actionType: undefined,
          },
        })
      );
    }
  }, [dispatch, can, eventId]);

  // Check if user can view audit logs
  const canViewAuditLogs = can(
    PERMISSIONS.VIEW_AUDIT_LOGS,
    RESOURCES.AUDIT_LOG
  );

  if (!canViewAuditLogs) {
    return null;
  }

  // Filter logs based on selected action type
  const filteredLogs = useFilteredAuditLogs(auditLogs, filterActionType);

  //  action type counts
  const actionTypeCounts = getActionTypeCounts(auditLogs);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F3EDE9] shadow-lg p-4 sm:p-6 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 mb-6 hover:shadow-xl transition-all duration-300 group">
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
        <div className="bg-gradient-to-br from-[#9B2C62] to-[#F59E0B] w-full h-full rounded-bl-full"></div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#801f4f] to-[#9B2C62]">
          <History className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Expense Audit Log
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {eventId ? "Records for this event" : "All expense audit records"}
            {paidExpensesCount > 0 &&
              ` • ${paidExpensesCount} paid expense deletion${
                paidExpensesCount !== 1 ? "s" : ""
              } recorded`}
          </p>
        </div>
        <button
          onClick={() => dispatch(fetchExpenseAuditLogs({ eventId }))}
          className="p-2 rounded-lg bg-[#9B2C62]/10 hover:bg-[#9B2C62]/20 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
          title="Refresh logs"
        >
          <RefreshCw className="w-4 h-4 text-[#9B2C62] dark:text-gray-300" />
        </button>
      </div>

      {/* Action Type Filter */}
      <ActionTypeFilter
        setFilterActionType={setFilterActionType}
        filterActionType={filterActionType}
        getActionIcon={getActionIcon}
        getActionLabel={getActionLabel}
        actionTypeCounts={actionTypeCounts}
      />

      {/* loading and error handling */}
      {auditLogStatus === "loading" ? (
        <AuditLogsLoading />
      ) : auditLogError ? (
        <AuditLogsErrorState
          auditLogError={auditLogError}
          dispatch={dispatch}
          fetchExpenseAuditLogs={fetchExpenseAuditLogs}
          eventId={eventId}
        />
      ) : // collapsed log
      !isExpanded ? (
        <CollapsedLog
          auditLogCount={auditLogCount}
          setIsExpanded={setIsExpanded}
          eventId={eventId}
        />
      ) : (
        // expanded log
        <div className="space-y-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Showing {filteredLogs.length} of {auditLogCount} audit record
            {auditLogCount !== 1 ? "s" : ""}
            {eventId && " for this event"}
          </div>

          {/* no filtered logs */}
          {filteredLogs.length === 0 ? (
            <NoFilteredLogs
              filterActionType={filterActionType}
              getActionLabel={getActionLabel}
            />
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {filteredLogs.map((log, index) => (
                <div
                  key={log._id || index}
                  className="p-4 bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl border border-[#F3EDE9] dark:border-gray-700 hover:border-[#9B2C62]/50 dark:hover:border-[#D97706]/50 transition-all duration-300"
                >
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

                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
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
                              {log.deletedBy?.name ||
                                log.performedBy?.name ||
                                "Unknown"}
                            </span>
                            {log.deletedBy?.role && (
                              <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
                                {log.deletedBy.role}
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
                                    dateStr
                                      ? formatYearMonthDay(dateStr)
                                      : "None";
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

                    {/* Expandable Details */}
                    <div className="mt-5">
                      <button
                        onClick={() =>
                          setExpandedLogId(
                            expandedLogId === log._id ? null : log._id
                          )
                        }
                        className="text-xs text-[#9B2C62] dark:text-[#D97706] hover:underline flex items-center gap-1"
                      >
                        {expandedLogId === log._id
                          ? "Show less"
                          : "View details"}
                        <ChevronDown
                          className={`h-3 w-3 transition-transform ${
                            expandedLogId === log._id ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* expandable details */}
                      {expandedLogId === log._id && (
                        <ExpenseLogExpandables
                          log={log}
                          formatCurrency={formatCurrency}
                          formatYearMonthDay={formatYearMonthDay}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center pt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {authUser.role === "super_admin"
                ? "Super administrators can view and delete paid expenses"
                : "Administrators can view audit logs"}
            </p>
            <button
              onClick={() => setIsExpanded(false)}
              className="mt-3 text-sm text-[#9B2C62] dark:text-[#D97706] hover:underline"
            >
              Collapse log
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseAuditLogPanel;
