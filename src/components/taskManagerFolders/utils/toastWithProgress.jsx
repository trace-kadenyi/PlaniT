import toast from "react-hot-toast";
import CustomToast from "../../ui/CustomToast";

export function toastWithProgress(message, duration = 4000) {
  toast.custom(
    (t) => <CustomToast t={t} message={message} duration={duration} />,
    {
      duration,
    }
  );
}
