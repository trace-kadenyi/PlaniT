import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import HeroImg from "../components/landing/HeroAnimation";
import {
  heroVariants,
  fadeUp,
  delayedFadeUp,
} from "../components/ui/FramerMotion";
import { useSelector } from "react-redux";

export default function HomePage() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const userDetails = currentUser
    ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim()
    : "";

  return (
    <main className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black text-[#374151] dark:text-gray-100 pb-4 md:pb-10">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 py-20 max-w-7xl mx-auto gap-10 h-screen">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="flex-1"
        >
          <motion.h1
            variants={fadeUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4"
          >
            Welcome
            {userDetails ? (
              <>
                <br />
                {userDetails}
              </>
            ) : (
              ""
            )}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-gray-600 dark:text-gray-300 mb-6 max-w-md text-lg"
          >
            Ready to plan your next successful event?
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <Link
              to="/events/new"
              className="bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex items-center"
            >
              <span>New Event</span>
            </Link>
            <button
              onClick={() => navigate("/clients/new")}
              className="bg-gradient-to-r from-[#9B2C62] to-[#7B1E5A] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex items-center"
            >
              <span>Add Client</span>
            </button>
            <button
              onClick={() => navigate("/product-overview")}
              className="border-2 border-[#F59E0B] text-[#F59E0B] px-6 py-3 rounded-xl font-semibold hover:text-white transform hover:-translate-y-1 transition-all duration-200 hover:bg-gray-900"
            >
              <span>Product Overview</span>
            </button>
          </motion.div>

          {/* Quick Stats/Links */}
          <motion.div
            variants={fadeUp}
            className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            <Link
              to="/events/board"
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="font-semibold text-[#9B2C62] dark:text-[#F59E0B]">
                Events
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Manage all events
              </div>
            </Link>
            <Link
              to="/tasks/board"
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="font-semibold text-[#9B2C62] dark:text-[#F59E0B]">
                Tasks
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Kanban board
              </div>
            </Link>
            <Link
              to="/dashboards"
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="font-semibold text-[#9B2C62] dark:text-[#F59E0B]">
                Dashboard
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                View insights
              </div>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={delayedFadeUp}
          initial="hidden"
          animate="visible"
          className="flex-1 flex justify-center items-center"
        >
          <HeroImg />
        </motion.div>
      </section>

      {/* Quick Start Guide Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative px-4 sm:px-6 pb-12 max-w-7xl mx-auto z-10"
      >
        <div className="bg-gradient-to-br from-[#FFF8F2]/80 to-white/60 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-6 md:p-8 border border-[#F3EDE9] dark:border-gray-700/50 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-[#9B2C62] dark:text-[#D97706] mb-4">
            Quick Start Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-lg border border-[#F3EDE9] dark:border-gray-700/50">
              <div className="text-sm font-semibold text-[#9B2C62] dark:text-[#F59E0B] mb-2">
                1. Add Team Members
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Invite your organization team and assign roles with appropriate
                permissions.
              </p>
            </div>
            <div className="p-4 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-lg border border-[#F3EDE9] dark:border-gray-700/50">
              <div className="text-sm font-semibold text-[#9B2C62] dark:text-[#F59E0B] mb-2">
                2. Create an Event
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Start by creating your first event with budget, timeline, and
                details.
              </p>
            </div>
            <div className="p-4 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-lg border border-[#F3EDE9] dark:border-gray-700/50">
              <div className="text-sm font-semibold text-[#9B2C62] dark:text-[#F59E0B] mb-2">
                3. Create & Assign Tasks
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Break down events into manageable tasks and assign them to team
                members.
              </p>
            </div>
            <div className="p-4 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-lg border border-[#F3EDE9] dark:border-gray-700/50">
              <div className="text-sm font-semibold text-[#9B2C62] dark:text-[#F59E0B] mb-2">
                4. Add Expenses
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Track event expenses with receipts and budget allocations.
              </p>
            </div>
            <div className="p-4 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-lg border border-[#F3EDE9] dark:border-gray-700/50">
              <div className="text-sm font-semibold text-[#9B2C62] dark:text-[#F59E0B] mb-2">
                5. Add Clients
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Create client profiles and assign them to relevant events.
              </p>
            </div>
            <div className="p-4 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-lg border border-[#F3EDE9] dark:border-gray-700/50">
              <div className="text-sm font-semibold text-[#9B2C62] dark:text-[#F59E0B] mb-2">
                6. Add Vendors
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Create vendor contacts and assign them to event expenses.
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
