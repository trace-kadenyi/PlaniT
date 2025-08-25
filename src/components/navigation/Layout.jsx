import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}