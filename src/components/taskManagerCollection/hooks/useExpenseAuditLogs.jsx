import { useMemo } from "react";

// filtered audit logs
export const useFilteredAuditLogs = (auditLogs, filterActionType) => {
  return useMemo(() => {
    if (filterActionType === "ALL") return auditLogs;
    return auditLogs.filter((log) => log.actionType === filterActionType);
  }, [auditLogs, filterActionType]);
};
