import { easeOut, motion } from "framer-motion";

import HeroImg from "../components/landing/HeroAnimation";
import { features, steps } from "../data/homeData";
import {
  ScrollFadeFunc,
  heroVariants,
  fadeUp,
  StepCard,
  delayedFadeUp,
} from "../components/ui/FramerMotion";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <main className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black text-[#374151] dark:text-gray-100">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 py-20 max-w-7xl mx-auto gap-10 h-screen sm:h-full">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="flex-1"
        >
          <motion.h1
            variants={fadeUp}
            className="text-4xl font-bold leading-tight mb-4"
          >
            Simplify Your <br /> Event Planning
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-gray-600 dark:text-gray-300 mb-6 max-w-md"
          >
            PlaniT helps event planners manage tasks, budgets, and resources
            efficiently, with elegance and ease.
          </motion.p>
          <motion.div variants={fadeUp} className="flex gap-4">
            <Link to="/events/new" className="bg-[#F59E0B] text-black font-semibold px-6 py-2 rounded hover:bg-[#d97706] transition">
              Get Started
            </Link>
            <button className="border border-[#F59E0B] text-[#F59E0B] px-6 py-2 rounded font-semibold hover:bg-[#fef3c7] transition">
              View Demo
            </button>
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

      {/* Core Features Section */}
      <ScrollFadeFunc>
        <section className="bg-gray-50 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-10 text-[#9B2C62] dark:text-[#D97706]">
              Core MVP Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: easeOut }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg shadow hover:shadow-md transition border border-gray-100 dark:shadow-gray-900/50 dark:hover:shadow-amber-900/20 dark:border dark:border-gray-700"
                >
                  <h4 className="text-lg font-semibold mb-2 text-[#BE3455] dark:text-[#F59E0B]">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ScrollFadeFunc>

      {/* Process or How it Works Section */}
      <ScrollFadeFunc>
        <section className="py-20 px-6 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-12 text-[#9B2C62] dark:text-[#D97706]">
              How PlaniT Works
            </h3>
            <div className="grid grid-cols-1 #E879Csm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
              {steps.map((step, index) => (
                <StepCard
                  key={index}
                  Icon={step.Icon}
                  stepNumber={index + 1}
                  title={step.title}
                  text={step.text}
                />
              ))}
            </div>
          </div>
        </section>
      </ScrollFadeFunc>
    </main>
  );
}
