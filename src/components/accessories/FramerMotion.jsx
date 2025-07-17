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



