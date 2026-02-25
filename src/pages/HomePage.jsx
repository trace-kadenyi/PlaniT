import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  Sparkles,
  CalendarCheck,
  Users,
  Target,
  PieChart,
  Clock,
  Zap,
  Shield,
  LayoutDashboard,
} from "lucide-react";

import HeroImg from "../components/landing/HeroAnimation";
import {
  heroVariants,
  fadeUp,
  delayedFadeUp,
  staggerContainer,
} from "../components/ui/FramerMotion";
import { quickStepGuide } from "../data/homeData";

export default function HomePage() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const userDetails = currentUser
    ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim()
    : "";

  const features = [
    {
      icon: LayoutDashboard,
      title: "Dashboard",
      description: "View insights and analytics",
      color: "from-[#8B5CF6] to-[#7C3AED]",
      link: "/dashboards",
    },
    {
      icon: CalendarCheck,
      title: "Event Management",
      description: "Create and manage multiple events with ease",
      color: "from-[#9B2C62] to-[#9B2C62]/80",
      link: "/events/board",
    },
    {
      icon: Target,
      title: "Task Tracking",
      description: "Kanban boards for seamless task organization",
      color: "from-[#F59E0B] to-[#F97316]",
      link: "/tasks/board",
    },

    {
      icon: Users,
      title: "Team Collaboration",
      description: "Invite team members and assign roles",
      color: "from-[#3B82F6] to-[#2563EB]",
      link: "/team",
    },
  ];

  const quickStartSteps = [
    {
      step: 1,
      title: "Add Team Members",
      description:
        "Invite your team and assign roles with appropriate permissions",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      step: 2,
      title: "Create an Event",
      description:
        "Start by creating your first event with budget, timeline, and details.",
      icon: CalendarCheck,
      color: "from-purple-500 to-purple-600",
    },
    {
      step: 3,
      title: "Create Tasks",
      description: "Break down events into manageable tasks",
      icon: Target,
      color: "from-orange-500 to-orange-600",
    },
    {
      step: 4,
      title: "Track Expenses",
      description: "Log expenses with receipts and budget allocation",
      icon: PieChart,
      color: "from-green-500 to-green-600",
    },
    {
      step: 5,
      title: "Manage Clients",
      description: "Create client profiles and assign to events",
      icon: Users,
      color: "from-pink-500 to-pink-600",
    },
    {
      step: 6,
      title: "Add Vendors",
      description: "Build your vendor network for future events",
      icon: Shield,
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <main className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100 pb-4 md:pb-10 px-3">
      {/* Hero Section with Enhanced Visuals */}
      <section className="relative overflow-hidden">
        <div className="relative px-4 sm:px-6 py-20 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[calc(100vh-5rem)]">
            {/* Text Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex-1 max-w-2xl text-center lg:text-left z-10"
            >
              {/* Welcome Badge */}
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9B2C62]/10 to-[#F59E0B]/10 dark:from-[#9B2C62]/20 dark:to-[#F59E0B]/20 px-4 py-2 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-[#9B2C62] dark:text-[#F59E0B]" />
                <span className="text-sm font-medium text-[#9B2C62] dark:text-[#F59E0B]">
                  Welcome {userDetails ? `, ${userDetails.split(" ")[0]}` : ""}!
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900 dark:text-white"
              >
                Ready to plan your next{" "}
                <span className="text-[#9B2C62] dark:text-[#F59E0B]">
                  successful
                </span>{" "}
                event?
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={fadeUp}
                className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0"
              >
                Your all-in-one platform for seamless event planning, team
                collaboration, and budget management.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
              >
                <Link
                  to="/product-overview"
                  className="group relative inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#9B2C62] to-[#9B2C62]/90 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Features
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B] to-[#F97316] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>

                <button
                  onClick={() => navigate("/events/new")}
                  className="px-8 py-3 bg-white dark:bg-transparent border-2 border-[#9B2C62]/20 dark:border-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl hover:border-[#9B2C62] dark:hover:border-[#F59E0B] hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <Zap className="w-5 h-5 text-[#9B2C62] dark:text-[#F59E0B]" />
                  Create New Event
                </button>
              </motion.div>

              {/* Feature Pills */}
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap gap-3 justify-center lg:justify-start"
              >
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Link
                      key={index}
                      to={feature.link}
                      className="group relative px-4 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-full border border-gray-200 dark:border-gray-700 hover:border-[#9B2C62]/30 dark:hover:border-[#F59E0B]/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#9B2C62] dark:text-[#F59E0B]" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {feature.title}
                        </span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#9B2C62] to-[#F59E0B] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
                    </Link>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              variants={delayedFadeUp}
              initial="hidden"
              animate="visible"
              className="flex-1 flex justify-center items-center max-w-lg w-full relative"
            >
              {/* Decorative Elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#9B2C62]/5 to-[#F59E0B]/5 rounded-full blur-3xl" />
              <div className="relative z-10">
                <HeroImg />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Start Guide Section stays mostly fine */}
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
            {quickStepGuide.map((step) => (
              <div className="p-4 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-lg border border-[#F3EDE9] dark:border-gray-700/50">
                <div className="text-sm font-semibold text-[#9B2C62] dark:text-[#F59E0B] mb-2">
                  {step.title}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </main>
  );
}
