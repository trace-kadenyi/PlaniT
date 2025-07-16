import HeroImg from "../components/landing/HeroAnimation2";
import LogoWordmark from "../components/headers/LogoWordmark";

export default function LandingPage() {
  return (
    <div className="bg-white text-[#374151] font-sans">
      {/* Header */}
      <header className="bg-[#9B2C62] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-1">
            <LogoWordmark />
          </div>
          <nav className="space-x-4">
            <button className="bg-white text-[#9B2C62] font-medium px-4 py-2 rounded hover:bg-[#f3f4f6] transition">
              Sign Up
            </button>
            <button className="border border-white px-4 py-2 rounded hover:bg-white hover:text-[#9B2C62] transition">
              Log In
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 py-20 max-w-7xl mx-auto gap-10">
        {/* Text Content */}
        <div className="flex-1">
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Simplify Your <br /> Event Planning
          </h2>
          <p className="text-gray-600 mb-6 max-w-md">
            PlaniT helps event planners manage tasks, budgets, and resources
            efficiently, with elegance and ease.
          </p>
          <div className="flex gap-4">
            <button className="bg-[#F59E0B] text-black font-semibold px-6 py-2 rounded hover:bg-[#d97706] transition">
              Get Started
            </button>
            <button className="border border-[#F59E0B] text-[#F59E0B] px-6 py-2 rounded font-semibold hover:bg-[#fef3c7] transition">
              View Demo
            </button>
          </div>
        </div>

        {/* Background Image Placeholder */}
        <div className="flex-1 flex justify-center items-center">
          <HeroImg />
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-10 text-[#9B2C62]">
            Core Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded shadow">
              <h4 className="text-lg font-semibold mb-2">Task Management</h4>
              <p className="text-sm text-gray-600">
                Assign tasks, set deadlines, and track progress easily.
              </p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h4 className="text-lg font-semibold mb-2">Budget Tracking</h4>
              <p className="text-sm text-gray-600">
                Manage expenses and stay within budget per event.
              </p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h4 className="text-lg font-semibold mb-2">
                Vendor Coordination
              </h4>
              <p className="text-sm text-gray-600">
                Store and manage vendor details and bookings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f3f4f6] text-sm text-center text-gray-600 py-6">
        &copy; {new Date().getFullYear()} PlaniT. All rights reserved.
      </footer>
    </div>
  );
}
