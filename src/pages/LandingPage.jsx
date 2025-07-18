import { easeOut, motion } from "framer-motion";

import HeroImg from "../components/landing/HeroAnimation2";
import LogoWordmark from "../components/headers/LogoWordmark";
import { features, steps } from "../data/homeData";
import {
  ScrollFadeFunc,
  heroVariants,
  fadeUp,
  StepCard,
  delayedFadeUp,
} from "../components/accessories/FramerMotion";
import EventList from "../components/taskManagerFolders/events/EventsList";
import TaskList from "../components/taskManagerFolders/tasks/TaskList";

export default function LandingPage() {
  return (
    <main className="bg-white text-[#374151]">
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
          <motion.p variants={fadeUp} className="text-gray-600 mb-6 max-w-md">
            PlaniT helps event planners manage tasks, budgets, and resources
            efficiently, with elegance and ease.
          </motion.p>
          <motion.div variants={fadeUp} className="flex gap-4">
            <button className="bg-[#F59E0B] text-black font-semibold px-6 py-2 rounded hover:bg-[#d97706] transition">
              Get Started
            </button>
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

      <div className="max-w-4xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <EventList />
        <TaskList />
      </div>

      {/* Core Features Section */}
      <ScrollFadeFunc>
        <section className="bg-gray-50 py-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-10 text-[#9B2C62]">
              Core MVP Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: easeOut }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded shadow hover:shadow-md transition"
                >
                  <h4 className="text-lg font-semibold mb-2 text-[#9B2C62]">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ScrollFadeFunc>

      {/* Process or How it Works Section */}
      <ScrollFadeFunc>
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-12 text-[#9B2C62]">
              How PlaniT Works
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
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
