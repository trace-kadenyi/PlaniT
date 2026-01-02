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

  const hasAccess = can(permission, resource, target);

  // ALWAYS allow dragging UI (isDragDisabled=false)
  // The actual permission check happens in handleEventDragEnd
  return (
    <Draggable
      draggableId={draggableId}
      index={index}
      isDragDisabled={false} // Always false so UI shows draggable
      {...draggableProps}
    >
      {children}
    </Draggable>
  );
};

export default PermissionDraggable;
