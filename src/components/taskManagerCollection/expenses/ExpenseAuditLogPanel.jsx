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
  AuditLogsIntro,
  AuditLogsOverview,
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
            // filtered logs available
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {filteredLogs.map((log, index) => (
                <div
                  key={log._id || index}
                  className="p-4 bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl border border-[#F3EDE9] dark:border-gray-700 hover:border-[#9B2C62]/50 dark:hover:border-[#D97706]/50 transition-all duration-300"
                >
                  {/* audit logs intro */}
                  <AuditLogsIntro
                    getActionIcon={getActionIcon}
                    log={log}
                    getActionColor={getActionColor}
                    getActionLabel={getActionLabel}
                    getCategoryColor={getCategoryColor}
                    formatCurrency={formatCurrency}
                    formatDateTimeShort={formatDateTimeShort}
                  />

                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    {/* audit logs overview - modified by and change fields */}
                    <AuditLogsOverview
                      log={log}
                      formatYearMonthDay={formatYearMonthDay}
                    />

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
