import toast from "react-hot-toast";
import CustomToast from "../../ui/CustomToast";

// toast with progress
export function toastWithProgress(message, duration = 4000) {
  toast.custom(
    (t) => <CustomToast t={t} message={message} duration={duration} />,
    {
      duration,
    }
  );
}

// task toast progress
export function taskToastProgress(message, duration = 8000) {
  toast.custom(
    (t) => <CustomToast t={t} message={message} duration={duration} />,
    {
      duration,
    }
  );
}
