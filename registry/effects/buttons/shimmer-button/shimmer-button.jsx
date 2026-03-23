"use client";

import { motion } from "framer-motion";

export function ShimmerButton({
  children,
  className = "",
  shimmerColor = "rgba(255, 255, 255, 0.4)",
  duration = 1.5,
  ...props
}) {
  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            120deg,
            transparent 0%,
            transparent 40%,
            ${shimmerColor} 50%,
            transparent 60%,
            transparent 100%
          )`,
        }}
        initial={{ x: "-100%" }}
        whileHover={{
          x: "100%",
          transition: {
            duration,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      />
    </motion.button>
  );
}
