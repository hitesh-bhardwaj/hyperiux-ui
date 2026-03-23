"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function AuroraBackground({
  children,
  className = "",
  colors = ["#4F46E5", "#7C3AED", "#EC4899", "#06B6D4"],
  blur = 100,
  speed = 0.5,
}) {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const gradients = colors.map((color, i) => {
    const offset = (i / colors.length) * 100;
    const rotation = useTransform(
      [x, y],
      ([latestX, latestY]) => {
        return (latestX + latestY) * speed * 0.1 + offset * 3.6;
      }
    );

    return (
      <motion.div
        key={i}
        className="absolute inset-0 opacity-50"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 50%)`,
          rotate: rotation,
        }}
      />
    );
  });

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{ filter: `blur(${blur}px)` }}
      >
        {gradients}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
