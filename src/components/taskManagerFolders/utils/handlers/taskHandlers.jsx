import toast from "react-hot-toast";

import { toastWithProgress } from "../toastWithProgress";
import DeleteConfirmationToast from "../deleteConfirmationToast";

export const createTaskDeleteHandler = (dispatch, deleteTask) => {
  return (taskId) => {
    const duration = 10000;
    toast(
      (t) => (
        <DeleteConfirmationToast
          t={t}
          duration={duration}
          type="task"
          onConfirm={() => {
            dispatch(deleteTask(taskId))
              .unwrap()
              .then(() => {
                toast.dismiss(t.id);
                toastWithProgress("Task deleted successfully");
              })
              .catch((err) => {
                toast.dismiss(t.id);
                toastWithProgress(`Failed to delete task: ${err}`);
              });
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      { duration, position: "top-center" }
    );
  };
};
