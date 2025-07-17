import { easeOut, motion } from "framer-motion";

import HeroImg from "../components/landing/HeroAnimation2";
import LogoWordmark from "../components/headers/LogoWordmark";
import { features, steps } from "../data/homeData";
import {
  ScrollFadeFunc,
  HoverFunc,
  heroVariants,
  fadeUp,
  StepCard,
  delayedFadeUp,
  EaseOutFunc,
} from "../components/accessories/FramerMotion";

export default function LandingPage() {
  return (
    <main className="bg-white text-[#374151] font-sans">
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

      {/* Core Features Section */}
      <ScrollFadeFunc>
        <section className="bg-gray-50 py-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-10 text-[#9B2C62]">
              Core MVP Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white p-6 rounded shadow hover:shadow-md transition"
                >
                  <h4 className="text-lg font-semibold mb-2 text-[#9B2C62]">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollFadeFunc>

      {/* Process or How it Works Section */}
      <ScrollFadeFunc>
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-12 text-[#9B2C62]">
              How PlaniT Works
            </h3>
            <div className="flex flex-col md:flex-row justify-between gap-10 text-left">
              {steps.map((step, index) => (
                <HoverFunc
                  key={index}
                  className="bg-gray-50 p-6 rounded shadow hover:shadow-md transition"
                >
                  <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.text}</p>
                </HoverFunc>
              ))}
            </div>
          </div>
        </section>
      </ScrollFadeFunc>

      {/* Call to Action Section */}
      <EaseOutFunc>
        <section className="bg-[#9B2C62] text-white py-16 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Ready to plan smarter?</h3>
            <p className="mb-6 text-lg">
              Join event pros using PlaniT to bring structure and clarity to
              their events. It’s your turn to plan like a pro.
            </p>
            <button className="bg-[#F59E0B] text-black font-semibold px-8 py-3 rounded hover:bg-[#d97706] transition">
              Sign Up Free
            </button>
          </div>
        </section>
      </EaseOutFunc>
    </main>
  );
}
