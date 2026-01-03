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
