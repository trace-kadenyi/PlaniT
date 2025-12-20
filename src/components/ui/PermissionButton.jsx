import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { usePermissions } from "../../globalHooks/userPermissions";

const PermissionButton = ({
  permission,
  resource = null,
  target = null,
  onClick,
  to,
  disabled = false,
  loading = false,
  tooltipTitle = "",
  fallbackTooltip = "",
  children,
  className = "",
  style = {},
  ...props
}) => {
  const { can } = usePermissions();

  const hasAccess = can(permission, resource, target);
  const shouldDisable = !hasAccess || disabled || loading;

  // Determine tooltip content
  const getTooltipContent = () => {
    if (!hasAccess && fallbackTooltip) return fallbackTooltip;
    if (loading) return "Loading...";
    if (disabled) return tooltipTitle;
    return tooltipTitle;
  };

  // Render as Link if 'to' prop is provided
  const renderAsLink = to && !shouldDisable;

  const baseElement = renderAsLink ? (
    <RouterLink
      to={to}
      className={`${className} ${
        shouldDisable ? "opacity-60 cursor-not-allowed" : ""
      }`}
      style={{
        ...style,
        cursor: shouldDisable ? "not-allowed" : "pointer",
      }}
      {...props}
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
    </RouterLink>
  ) : (
    <button
      onClick={hasAccess && !shouldDisable ? onClick : undefined}
      disabled={shouldDisable}
      className={`${className} ${
        shouldDisable ? "opacity-60 cursor-not-allowed" : ""
      }`}
      style={{
        ...style,
        cursor: shouldDisable ? "not-allowed" : "pointer",
      }}
      {...props}
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
        <span>{baseElement}</span>
      </Tooltip>
    );
  }

  return baseElement;
};

export default PermissionButton;
