import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Scroll fade function
export const ScrollFadeFunc = ({ children }) => {
  const ref = useRef(null);
  const isView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
};
// EaseOut function
export const EaseOutFunc = ({ children }) => {
  const ref = useRef(null);
  const isView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// hover function
export const HoverFunc = ({ children, className }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// hero variants func
export const heroVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
      ease: "easeOut",
      duration: 0.2,
    },
  },
};

// fadeup function
export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeOut", duration: 0.6 },
  },
};

// // step card
export const StepCard = ({ Icon, stepNumber, title, text }) => (
  <HoverFunc className="flex flex-col items-center text-center w-full max-w-xs p-6 bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 mx-auto">
    <div className="relative">
      <Icon className="w-16 h-16 p-3 bg-white dark:bg-gray-800 border-2 border-blue-100 dark:border-gray-700 rounded-full shadow-md text-blue-500 dark:text-blue-400" />
      <div className="absolute -top-2 -right-2 bg-green-500 dark:bg-green-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
        {stepNumber}
      </div>
    </div>
    <h4 className="mt-4 text-lg font-semibold text-[#111827] dark:text-white">{title}</h4>
    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{text}</p>
  </HoverFunc>
);


// delayed fadeup func
export const delayedFadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.6, // Adjust this delay to match your stagger timing
      ease: "easeOut",
      duration: 0.6,
    },
  },
};
