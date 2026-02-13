import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Archive, RefreshCw, History, Trash2, DollarSign } from "lucide-react";

import {
  fetchDeletedEventExpenses,
  setExpandedEventId,
} from "../../../redux/deletedEventsAuditSlice";

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
} from "../utils/auditLogHelpers";
import { useFilteredAuditLogs } from "../hooks/useExpenseAuditLogs";
import {
  ActionTypeFilter,
  AuditLogsIntro,
  AuditLogsOverview,
  NoFilteredLogs,
} from "../../ui/AuditLogFragments";
import { AuditLogsLoading } from "../../shared/LoadingStates";
import { AuditLogsErrorState } from "../../shared/ErrorStates";
import DeletedEventLogExpandables from "./DeletedEventLogExpandables";

const DeletedEventsAuditPanel = () => {
  const dispatch = useDispatch();
  const { can } = usePermissions();

  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [filterActionType, setFilterActionType] = useState("ALL");

  const { groupedByEvent, logs, status, error, expandedEventId } = useSelector(
    (state) => state.deletedEventsAudit,
  );

  const canViewAuditLogs = can(
    PERMISSIONS.VIEW_AUDIT_LOGS,
    RESOURCES.AUDIT_LOG,
  );

  // Fetch deleted event expense logs when panel is expanded
  useEffect(() => {
    if (canViewAuditLogs && isExpanded && status === "idle") {
      dispatch(fetchDeletedEventExpenses());
    }
  }, [dispatch, canViewAuditLogs, isExpanded, status]);

  if (!canViewAuditLogs) {
    return null;
  }

  // Transform groupedByEvent into a flat array of logs for filtering
  const allLogs =
    groupedByEvent?.flatMap(
      (event) =>
        event.expenses?.map((expense) => ({
          ...expense,
          event: {
            _id: event.eventId,
            name: event.eventName,
            deletedAt: event.deletedAt,
          },
        })) || [],
    ) || [];

  // Filter logs based on selected action type
  const filteredLogs = useFilteredAuditLogs(allLogs, filterActionType);

  // Calculate totals
  const totalDeletedEvents = groupedByEvent?.length || 0;
  const totalDeletedExpenses = allLogs.length;
  const totalDeletedAmount =
    groupedByEvent?.reduce((sum, event) => sum + (event.totalAmount || 0), 0) ||
    0;

  const handleRefresh = () => {
    dispatch(fetchDeletedEventExpenses());
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F3EDE9] shadow-lg p-4 sm:p-6 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 mb-8 hover:shadow-xl transition-all duration-300 group">
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
        <div className="bg-gradient-to-br from-[#6B3B0F] to-[#9B2C62] w-full h-full rounded-bl-full"></div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#6B3B0F] to-[#9B2C62]">
          <Archive className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Deleted Events Financial Trail
            </h2>
            {totalDeletedEvents > 0 && (
              <span className="px-2.5 py-1 bg-[#6B3B0F]/10 text-[#6B3B0F] dark:bg-[#6B3B0F]/20 dark:text-[#F59E0B] rounded-full text-xs font-medium">
                {totalDeletedEvents} event{totalDeletedEvents !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Permanently deleted events with expense history •{" "}
            <span className="font-medium">
              {formatCurrency(totalDeletedAmount)} in deleted expenses
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-[#9B2C62]/10 hover:bg-[#9B2C62]/20 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-[#9B2C62] dark:text-gray-300" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              isExpanded
                ? "bg-[#6B3B0F] text-white hover:bg-[#5a3210]"
                : "bg-[#6B3B0F]/10 text-[#6B3B0F] hover:bg-[#6B3B0F]/20 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isExpanded ? "Hide" : "View"} Deleted Events
            </span>
          </button>
        </div>
      </div>

      {/* Collapsed State - Keep the original summary */}
      {!isExpanded && totalDeletedEvents > 0 && (
        <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-5 border border-[#F3EDE9] dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-red-100 border-2 border-white dark:bg-red-900 dark:border-gray-800 flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-white dark:bg-amber-900 dark:border-gray-800 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">{totalDeletedEvents}</span>{" "}
                  deleted event{totalDeletedEvents !== 1 ? "s" : ""} with{" "}
                  <span className="font-semibold">{totalDeletedExpenses}</span>{" "}
                  expense{totalDeletedExpenses !== 1 ? "s" : ""} totaling{" "}
                  <span className="font-semibold">
                    {formatCurrency(totalDeletedAmount)}
                  </span>
                </p>
              </div>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Click View Deleted Events for complete financial trail
            </span>
          </div>
        </div>
      )}

      {/* Expanded State - Now using the same structure as ExpenseAuditLogPanel */}
      {isExpanded && (
        <div className="space-y-4">
          {status === "loading" && <AuditLogsLoading />}

          {status === "failed" && (
            <AuditLogsErrorState
              auditLogError={error}
              dispatch={dispatch}
              fetchExpenseAuditLogs={fetchDeletedEventExpenses}
            />
          )}

          {status === "succeeded" && allLogs.length === 0 && (
            <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-12 border border-[#F3EDE9] dark:border-gray-700 text-center">
              <div className="mx-auto max-w-sm flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 flex items-center justify-center mb-4">
                  <Archive className="w-8 h-8 text-[#F59E0B]" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  No Deleted Event Records
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No events with expenses have been permanently deleted yet
                </p>
              </div>
            </div>
          )}

          {status === "succeeded" && allLogs.length > 0 && (
            <>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Showing {filteredLogs.length} of {allLogs.length} deleted
                expense record
                {allLogs.length !== 1 ? "s" : ""}
              </div>

              {/* No Filtered Logs */}
              {filteredLogs.length === 0 ? (
                <NoFilteredLogs
                  filterActionType={filterActionType}
                  getActionLabel={getActionLabel}
                />
              ) : (
                // Filtered Logs Available
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 minimal-scrollbar">
                  {filteredLogs.map((log, index) => (
                    <div
                      key={log._id || index}
                      className="p-4 bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl border border-[#F3EDE9] dark:border-gray-700 hover:border-[#9B2C62]/50 dark:hover:border-[#D97706]/50 transition-all duration-300"
                    >
                      {/* Audit Logs Intro */}
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
                        {/* Audit Logs Overview */}
                        <AuditLogsOverview
                          log={log}
                          formatYearMonthDay={formatYearMonthDay}
                        />

                        {/* Expandable Details */}
                        <DeletedEventLogExpandables
                          setExpandedLogId={setExpandedLogId}
                          expandedLogId={expandedLogId}
                          log={log}
                          formatYearMonthDay={formatYearMonthDay}
                          isDeletedEvent={true}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  These expenses were automatically deleted when their parent
                  events were removed
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Only administrators can view deleted financial records
                </p>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="mt-3 text-sm text-[#9B2C62] dark:text-[#D97706] hover:underline"
                >
                  Collapse log
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DeletedEventsAuditPanel;
