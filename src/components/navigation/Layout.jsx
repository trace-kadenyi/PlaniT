import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useSocket } from "../../globalHooks/useSocket";
import { toastWithProgress } from "../../globalHooks/useToastWithProgress";

import Sidebar from "./Sidebar";
import Footer from "../footer/Footer";

export default function Layout() {
  const socketRef = useSocket();

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on("notification", (data) => {
      toastWithProgress(data.message);
    });

    return () => socket.off("notification");
  }, [socketRef.current]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      {/* Main Content */}
      <main className="hide-scrollbar flex-1 overflow-y-auto">
        <div>
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
}
