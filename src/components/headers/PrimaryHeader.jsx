import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Assuming shadcn or similar
import LogoWordmark from "./LogoWordmark";

export default function PrimaryHeader() {
  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center space-x-4">
          <Link to="/">
            <LogoWordmark />
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <Link to="/dashboard" className="hover:text-blue-500 transition">
            Dashboard
          </Link>
          <Link to="/events" className="hover:text-blue-500 transition">
            Events
          </Link>
          <Link to="/tasks" className="hover:text-blue-500 transition">
            Tasks
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
          <Link to="/signin">
            <Button variant="outline">Sign In</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
