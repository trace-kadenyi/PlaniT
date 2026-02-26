import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { EaseOutFunc } from "../ui/FramerMotion";

export default function Footer() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <EaseOutFunc>
      <section className="bg-[#9B2C62] text-white py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">
            Bring structure to every event.
          </h3>

          <p className="mb-10 text-lg">
            Manage teams, budgets, and timelines in one structured workspace
            built to keep complex events under control.
          </p>
          {isAuthenticated ? (
            <Link
              to="/events/new"
              className="bg-[#F59E0B] text-black font-semibold px-8 py-3 rounded hover:bg-[#d97706] transition"
            >
              Get Started
            </Link>
          ) : (
            <Link
              to="/signup"
              className="bg-[#F59E0B] text-black font-semibold px-8 py-3 rounded hover:bg-[#d97706] transition"
            >
              Sign Up Free
            </Link>
          )}
        </div>
      </section>
    </EaseOutFunc>
  );
}
