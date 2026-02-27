"use client";

import { motion } from "framer-motion";

interface AnimatedRupeeProps {
  className?: string;
}

/**
 * Animated ₹ symbol — glowing, floating, with particle ring effect.
 * Used as a hero backdrop on the landing page.
 */
export default function AnimatedRupee({ className = "" }: AnimatedRupeeProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer glow rings */}
      <motion.div
        className="absolute rounded-full border border-amber-500/10"
        style={{ width: "120%", height: "120%" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full border border-amber-400/5"
        style={{ width: "150%", height: "150%" }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute rounded-full border border-yellow-500/5"
        style={{ width: "180%", height: "180%" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Radial glow behind */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.03) 40%, transparent 70%)",
          filter: "blur(30px)",
          transform: "scale(2)",
        }}
      />

      {/* Floating particles around the rupee */}
      {[...Array(6)].map((_, i) => {
        const angle = (360 / 6) * i;
        const delay = i * 0.6;
        return (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-amber-400/60"
            style={{
              transformOrigin: "center",
            }}
            animate={{
              x: [
                Math.cos((angle * Math.PI) / 180) * 60,
                Math.cos(((angle + 60) * Math.PI) / 180) * 80,
                Math.cos(((angle + 120) * Math.PI) / 180) * 60,
                Math.cos((angle * Math.PI) / 180) * 60,
              ],
              y: [
                Math.sin((angle * Math.PI) / 180) * 60,
                Math.sin(((angle + 60) * Math.PI) / 180) * 80,
                Math.sin(((angle + 120) * Math.PI) / 180) * 60,
                Math.sin((angle * Math.PI) / 180) * 60,
              ],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }}
          />
        );
      })}

      {/* The ₹ symbol */}
      <motion.span
        className="relative font-black bg-gradient-to-b from-amber-300 via-yellow-500 to-amber-600 bg-clip-text text-transparent select-none"
        style={{
          fontSize: "inherit",
          lineHeight: 1,
          textShadow: "0 0 60px rgba(212,175,55,0.3), 0 0 120px rgba(212,175,55,0.1)",
        }}
        animate={{
          y: [-8, 8, -8],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        ₹
      </motion.span>
    </div>
  );
}
