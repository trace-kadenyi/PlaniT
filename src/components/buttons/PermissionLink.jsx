import React from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";

import { usePermissions } from "../../globalHooks/userPermissions";

const PermissionLink = ({
  permission,
  resource = null,
  target = null,
  to,
  children,
  className = "",
  tooltipTitle = "",
  fallbackTooltip = "",
  ...linkProps
}) => {
  const { can } = usePermissions();
  const hasAccess = can(permission, resource, target);

  const baseElement = hasAccess ? (
    <Link to={to} className={className} {...linkProps}>
      {children}
    </Link>
  ) : (
    <span
      className={`${className} opacity-60 cursor-not-allowed`}
      style={{ pointerEvents: "none" }}
    >
      {children}
    </span>
  );

  const tooltipContent = hasAccess ? tooltipTitle : fallbackTooltip;

  if (tooltipContent) {
    return (
      <Tooltip title={tooltipContent} arrow>
        <span>{baseElement}</span>
      </Tooltip>
    );
  }

  return baseElement;
};

export default PermissionLink;
