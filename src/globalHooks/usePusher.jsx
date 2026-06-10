import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Pusher from "pusher-js";
import { selectCurrentUser } from "../redux/authSlice";

export function usePusher() {
  const channelRef = useRef(null);
  const pusherRef = useRef(null);
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    if (!user?._id) return;

    try {
      pusherRef.current = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
        cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      });

      channelRef.current = pusherRef.current.subscribe(`user-${user._id}`);

      pusherRef.current.connection.bind("error", (err) => {
        console.warn("Pusher connection error (non-critical):", err.message);
      });
    } catch (err) {
      console.warn("Pusher failed to initialize (non-critical):", err.message);
    }

    return () => {
      try {
        channelRef.current?.unsubscribe();
        pusherRef.current?.disconnect();
      } catch (err) {
        // silent cleanup
      }
    };
  }, [user?._id]);

  return channelRef;
}
