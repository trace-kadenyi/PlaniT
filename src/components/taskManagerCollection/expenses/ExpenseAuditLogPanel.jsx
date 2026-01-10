import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  History,
  FileText,
  Calendar,
  User,
  DollarSign,
  ChevronDown,
  Shield,
  Receipt,
  Tag,
  Edit,
  ArrowUpDown,
  RefreshCw,
  CircleDollarSign,
  CirclePlus,
  Shapes,
} from "lucide-react";

import { fetchExpenseAuditLogs } from "../../../redux/expensesSlice";
import {
  usePermissions,
  PERMISSIONS,
  RESOURCES,
} from "../../../globalHooks/userPermissions";
import { formatDateTimeShort } from "../utils/formatting";
import {
  formatDashDate,
  formatForDateTimeLocal,
  formatLocalDateTimeForDisplay,
  formatYearMonthDay,
  getLocalDateTimeString,
  parseFromDateTimeLocal,
} from "../../../globalUtils/dateHelpers";

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

  useEffect(() => {
    if (can(PERMISSIONS.VIEW_AUDIT_LOGS, RESOURCES.AUDIT_LOG)) {
      dispatch(
        fetchExpenseAuditLogs({
          eventId,
          filters: {
            ...auditLogFilters,
            actionType:
              filterActionType !== "ALL" ? filterActionType : undefined,
          },
        })
      );
    }
  }, [dispatch, can, eventId, filterActionType]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getCategoryColor = (category) => {
    const colors = {
      venue:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      catering:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      decorations:
        "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      equipment:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      staffing:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      entertainment:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      transportation:
        "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
      marketing:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      "photography/videography":
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return colors[category] || colors.other;
  };

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case "CREATE":
        return <Tag className="w-3 h-3" />;
      case "UPDATE":
        return <Edit className="w-3 h-3" />;
      case "DELETE":
        return <Receipt className="w-3 h-3" />;
      case "AMOUNT_CHANGE":
        return <DollarSign className="w-3 h-3" />;
      case "STATUS_CHANGE":
        return <ArrowUpDown className="w-3 h-3" />;
      default:
        return <History className="w-3 h-3" />;
    }
  };

  const getActionColor = (actionType) => {
    switch (actionType) {
      case "CREATE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "UPDATE":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "DELETE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "AMOUNT_CHANGE":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "STATUS_CHANGE":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getActionLabel = (actionType) => {
    switch (actionType) {
      case "CREATE":
        return "Created";
      case "UPDATE":
        return "Updated";
      case "DELETE":
        return "Deleted";
      case "AMOUNT_CHANGE":
        return "Amount Changed";
      case "STATUS_CHANGE":
        return "Status Changed";
      default:
        return "Modified";
    }
  };

  // Check if user can view audit logs
  const canViewAuditLogs = can(
    PERMISSIONS.VIEW_AUDIT_LOGS,
    RESOURCES.AUDIT_LOG
  );

  if (!canViewAuditLogs) {
    return null;
  }

  // Filter logs based on selected action type
  const filteredLogs =
    filterActionType === "ALL"
      ? auditLogs
      : auditLogs.filter((log) => log.actionType === filterActionType);

  const actionTypeCounts = {
    ALL: auditLogs.length,
    DELETE: auditLogs.filter((log) => log.actionType === "DELETE").length,
    UPDATE: auditLogs.filter((log) => log.actionType === "UPDATE").length,
    CREATE: auditLogs.filter((log) => log.actionType === "CREATE").length,
    AMOUNT_CHANGE: auditLogs.filter((log) => log.actionType === "AMOUNT_CHANGE")
      .length,
    STATUS_CHANGE: auditLogs.filter((log) => log.actionType === "STATUS_CHANGE")
      .length,
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F3EDE9] shadow-lg p-6 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 mb-6 hover:shadow-xl transition-all duration-300 group">
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity">
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
        {auditLogStatus === "succeeded" && (
          <button
            onClick={() => dispatch(fetchExpenseAuditLogs({ eventId }))}
            className="p-2 rounded-lg bg-[#9B2C62]/10 hover:bg-[#9B2C62]/20 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4 text-[#9B2C62] dark:text-gray-300" />
          </button>
        )}
      </div>

      {/* Action Type Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            "ALL",
            "DELETE",
            "UPDATE",
            "CREATE",
            "AMOUNT_CHANGE",
            "STATUS_CHANGE",
          ].map((type) => (
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
          ))}
        </div>
      </div>

      {auditLogStatus === "loading" ? (
        <div className="flex justify-center items-center py-8 min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9B2C62]"></div>
        </div>
      ) : auditLogError ? (
        <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-8 border border-[#F3EDE9] dark:border-gray-700 text-center">
          <div className="mx-auto max-w-sm flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
              Error loading audit logs
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {auditLogError || "Failed to load audit logs"}
            </p>
            <button
              onClick={() => dispatch(fetchExpenseAuditLogs({ eventId }))}
              className="mt-4 px-4 py-2 text-sm bg-[#9B2C62] hover:bg-[#801f4f] text-white rounded-md transition"
            >
              Retry
            </button>
          </div>
        </div>
      ) : !isExpanded ? (
        <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-8 border border-[#F3EDE9] dark:border-gray-700 text-center">
          <div className="mx-auto max-w-sm flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
              Expense Audit Log
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              {auditLogCount} audit record{auditLogCount !== 1 ? "s" : ""}{" "}
              recorded
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
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Showing {filteredLogs.length} of {auditLogCount} audit record
            {auditLogCount !== 1 ? "s" : ""}
            {eventId && " for this event"}
          </div>

          {filteredLogs.length === 0 ? (
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
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Modified by:{" "}
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {log.deletedBy?.name ||
                                log.performedBy?.name ||
                                "Unknown"}
                            </span>
                            {log.deletedBy?.role && (
                              <span className="ml-2 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
                                {log.deletedBy.role}
                              </span>
                            )}
                          </span>
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
                    <div className="mt-3">
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

                      {expandedLogId === log._id && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            {/* Left Column - Created Info */}
                            <div className="space-y-2">
                              {/* Created by */}
                              <div className="flex items-center gap-2">
                                <User className="w-3 h-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                <div className="flex flex-wrap items-center gap-1">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Created by:
                                  </span>
                                  <span className="font-medium text-[#6B3B0F] dark:text-gray-300">
                                    {log.expenseData?.createdBy?.firstName ||
                                      "Unknown"}
                                    {log.expenseData?.createdBy?.lastName &&
                                      ` ${log.expenseData.createdBy.lastName}`}
                                  </span>
                                  {log.expenseData?.createdBy?.role && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
                                      {log.expenseData.createdBy.role}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Created on */}
                              <div className="flex items-center gap-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-3 h-3 text-gray-500 dark:text-gray-400 flex-shrink-0"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400 mr-1">
                                    Created on:
                                  </span>
                                  <span className="font-medium text-[#6B3B0F] dark:text-gray-300">
                                    {formatYearMonthDay(
                                      log.expenseData?.createdAt
                                    )}
                                  </span>
                                </div>
                              </div>

                              {/* Paid on */}
                              {log.expenseData?.paymentDate && (
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-3 h-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                  <div>
                                    <span className="text-gray-600 dark:text-gray-400 mr-1">
                                      Paid on:
                                    </span>
                                    <span className="font-medium text-[#6B3B0F] dark:text-gray-300">
                                      {formatYearMonthDay(
                                        log.expenseData.paymentDate
                                      )}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Event name */}
                              {log.event?.name && (
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-3 h-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                  <div>
                                    <span className="text-gray-600 dark:text-gray-400 mr-1">
                                      Event:
                                    </span>
                                    <span className="font-medium text-[#6B3B0F] dark:text-gray-300">
                                      {log.event.name}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Right Column - Budget & Additional Info */}
                            <div className="space-y-2">
                              {/* Budget before/after */}
                              {log.metadata && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="w-3 h-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                    <div>
                                      <span className="text-gray-600 dark:text-gray-400 mr-1">
                                        Budget before:
                                      </span>
                                      <span className="font-medium text-[#6B3B0F] dark:text-gray-300">
                                        {formatCurrency(
                                          log.metadata.budgetRemainingBefore ||
                                            0
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="w-3 h-3 text-green-500 dark:text-green-400 flex-shrink-0" />
                                    <div>
                                      <span className="text-gray-600 dark:text-gray-400 mr-1">
                                        Budget after:
                                      </span>
                                      <span className="font-medium text-green-600 dark:text-green-400">
                                        {formatCurrency(
                                          log.metadata.budgetRemainingAfter || 0
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </>
                              )}

                              {/* Vendor */}
                              {log.expenseData?.vendor && (
                                <div className="flex items-center gap-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-3 h-3 text-gray-500 dark:text-gray-400 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                  </svg>
                                  <div>
                                    <span className="text-gray-600 dark:text-gray-400 mr-1">
                                      Vendor:
                                    </span>
                                    <span className="font-medium text-[#6B3B0F] dark:text-gray-300">
                                      {log.expenseData.vendor.name}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* No. of changes */}
                              {log.changes && log.changes.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <Shapes className="w-3 h-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                  <div>
                                    <span className="text-gray-600 dark:text-gray-400 mr-1">
                                      Fields Changed:
                                    </span>
                                    <span className="font-medium text-[#6B3B0F] dark:text-gray-300">
                                      {log.changes.length}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Full Width - Reason */}
                            {log.reason && (
                              <div className="md:col-span-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-start gap-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-3 h-3 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <div>
                                    <span className="text-gray-600 dark:text-gray-400 mr-1">
                                      Reason:
                                    </span>
                                    <span className="text-[#6B3B0F] dark:text-gray-300">
                                      {log.reason}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
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
