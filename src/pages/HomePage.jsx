import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowRight, Sparkles, Plus } from "lucide-react";

import HeroImg from "../components/landing/HeroAnimation";
import {
  fadeUp,
  delayedFadeUp,
  staggerContainer,
} from "../components/ui/FramerMotion";
import { quickAccess, quickStepGuide } from "../data/homeData";
import ProductLogo from "../components/productOverview/ProductLogo";

export default function HomePage() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const firstName = currentUser?.firstName || "";

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
              {/* 1. Personal greeting  */}
              <motion.div variants={fadeUp} className="mb-2">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9B2C62]/10 to-[#F59E0B]/10 dark:from-[#9B2C62]/20 dark:to-[#F59E0B]/20 px-4 py-2 rounded-full mb-6">
                  <Sparkles className="w-4 h-4 text-[#9B2C62] dark:text-[#F59E0B]" />
                  <span className="text-xs font-semibold tracking-widest uppercase text-[#9B2C62] dark:text-[#F59E0B]">
                    Your Workspace
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white mb-4">
                  {firstName ? (
                    <>
                      Hello,{" "}
                      <span className="text-[#9B2C62] dark:text-[#F59E0B]">
                        {firstName}
                      </span>
                      .
                    </>
                  ) : (
                    "Hello,"
                  )}
                </h1>
              </motion.div>

              {/* 2. Platform identity  */}

              <motion.div
                variants={fadeUp}
                className="mb-8 pl-0.5 border-l-2 border-[#9B2C62]/20 dark:border-[#F59E0B]/20 ml-0.5 pl-4"
              >
                <div
                  className="mb-1 w-fit mx-auto lg:mx-0"
                  style={{
                    transform: "scale(0.7)",
                    transformOrigin: "left center",
                    height: "10px",
                  }}
                >
                  <ProductLogo />
                </div>

                {/* <p className="text-sm font-bold tracking-widest text-[#9B2C62] dark:text-[#F59E0B] mb-1">
                  PlaniT
                </p> */}
                <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed pl-3 mt-5">
                  Your all-in-one platform for seamless event planning, team
                  collaboration, and budget management.
                </p>
              </motion.div>

              {/* 3. Call to action */}
              <motion.p
                variants={fadeUp}
                className="text-base text-gray-600 dark:text-gray-300 mb-8"
              >
                Ready to plan your next event?
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
                  <Plus className="w-5 h-5 text-[#9B2C62] dark:text-[#F59E0B]" />
                  New Event
                </button>
              </motion.div>

              {/* Quick access grid */}
              <motion.div
                variants={fadeUp}
                className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {quickAccess.map(({ to, icon: Icon, label, sub, accent }) => (
                  <Link
                    key={to}
                    to={to}
                    className="group flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 hover:border-[#9B2C62]/30 dark:hover:border-[#F59E0B]/30 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 justify-center sm:justify-start"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{ backgroundColor: `${accent}18` }}
                    >
                      <Icon size={16} style={{ color: accent }} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {label}
                      </div>
                      <div className="text-xs text-gray-400">{sub}</div>
                    </div>
                  </Link>
                ))}
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
        {/* Section header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#9B2C62]/20 dark:to-[#F59E0B]/20" />
          <span className="text-xs font-bold tracking-widest uppercase text-[#9B2C62] dark:text-[#F59E0B]  px-2">
            Quick Start Guide
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#9B2C62]/20 dark:to-[#F59E0B]/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickStepGuide.map(({ step, title, description }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.07 }}
              className="group relative p-5 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/40 hover:border-[#9B2C62]/25 dark:hover:border-[#F59E0B]/25 hover:shadow-md transition-all duration-200"
            >
              {/* Step number — large background */}
              <span className="absolute top-3 right-4 text-5xl font-black text-gray-200 dark:text-gray-700/60 select-none leading-none group-hover:text-[#9B2C62]/10 dark:group-hover:text-[#F59E0B]/10 transition-colors duration-300">
                {step}
              </span>
              {/* Accent bar */}
              <div className="w-6 h-1 rounded-full bg-gradient-to-r from-[#9B2C62] to-[#F59E0B] mb-4" />
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1.5 relative">
                {title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed relative">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
