import toast from "react-hot-toast";

import CustomToast from "../components/ui/CustomToast";

// toast with progress
export function toastWithProgress(message, duration = 4000) {
  toast.custom(
    (t) => (
      <CustomToast
        t={t}
        message={message}
        duration={duration}
        onDone={() => toast.dismiss(t.id)}
      />
    ),
    { duration: Infinity },
  );
}

// task toast progress
export function taskToastProgress(message, duration = 8000) {
  toast.custom(
    (t) => <CustomToast t={t} message={message} duration={duration} />,
    { duration: Infinity },
  );
}
