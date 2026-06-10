import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { usePusher } from "../../globalHooks/usePusher";
import { toastWithProgress } from "../../globalHooks/useToastWithProgress";

import Sidebar from "./Sidebar";
import Footer from "../footer/Footer";

export default function Layout() {
  const channelRef = usePusher();

  useEffect(() => {
    const channel = channelRef.current;
    if (!channel) return;

    channel.bind("notification", (data) => {
      toastWithProgress(data.message);
    });

    return () => channel.unbind("notification");
  }, [channelRef.current]);

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
