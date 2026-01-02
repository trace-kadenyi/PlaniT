import { Draggable } from "@hello-pangea/dnd";
import { usePermissions } from "../../globalHooks/userPermissions";

const PermissionDraggable = ({
  permission,
  resource,
  target,
  disabled = false,
  children,
  draggableId,
  index,
  ...draggableProps
}) => {
  const { can } = usePermissions();

  // Debug logging
  //   console.log("Current user:", currentUser);
  //   console.log("Permission check for:", permission, resource, target);
  //   console.log("Can drag?", can(permission, resource, target));

  const hasAccess = can(permission, resource, target);
  const shouldDisable = !hasAccess || disabled;

  return (
    <Draggable
      draggableId={draggableId}
      index={index}
      isDragDisabled={shouldDisable}
      {...draggableProps}
    >
      {children}
    </Draggable>
  );
};

export default PermissionDraggable;
