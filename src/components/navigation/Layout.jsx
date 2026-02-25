import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Footer from "../footer/Footer";

export default function Layout() {
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
