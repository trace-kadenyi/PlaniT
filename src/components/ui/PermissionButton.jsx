import React from "react";
import { Tooltip } from "@mui/material";
import { usePermissions } from "../../globalHooks/userPermissions";

const PermissionButton = ({
  permission,
  resource = null,
  onClick,
  disabled = false,
  loading = false,
  tooltipTitle = "",
  fallbackTooltip = "",
  children,
  className = "",
  style = {},
  ...buttonProps
}) => {
  const { can } = usePermissions();

  const hasAccess = can(permission, resource);
  const shouldDisable = !hasAccess || disabled || loading;

  // Determine tooltip content
  const getTooltipContent = () => {
    if (!hasAccess && fallbackTooltip) return fallbackTooltip;
    if (loading) return "Loading...";
    if (disabled) return tooltipTitle;
    return tooltipTitle;
  };

  const button = (
    <button
      onClick={hasAccess ? onClick : undefined}
      disabled={shouldDisable}
      className={`${className} ${
        shouldDisable ? "opacity-60 cursor-not-allowed" : ""
      }`}
      style={{
        ...style,
        cursor: shouldDisable ? "not-allowed" : "pointer",
      }}
      {...buttonProps}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );

  // Wrap with tooltip if we have tooltip content
  const tooltipContent = getTooltipContent();
  if (tooltipContent) {
    return (
      <Tooltip title={tooltipContent} arrow>
        <span>{button}</span>
      </Tooltip>
    );
  }

  return button;
};

export default PermissionButton;
