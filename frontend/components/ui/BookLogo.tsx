"use client";

import { motion } from "framer-motion";

interface BookLogoProps {
  size?: number;
  className?: string;
}

/**
 * Animated 3D Book Logo — Pages flip left/right with a gold ₹ on the cover.
 * Pure CSS + Framer Motion. No external assets needed.
 */
export default function BookLogo({ size = 48, className = "" }: BookLogoProps) {
  const w = size;
  const h = size * 1.25;
  const pageW = w * 0.42;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: w, height: h, perspective: "600px" }}
    >
      {/* Book spine / cover */}
      <div
        className="absolute rounded-sm bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-700 shadow-lg shadow-amber-500/30"
        style={{ width: w * 0.12, height: h, left: "50%", transform: "translateX(-50%)", zIndex: 5 }}
      />

      {/* Back cover */}
      <div
        className="absolute rounded-r-sm bg-gradient-to-br from-amber-700 to-amber-900 shadow-inner"
        style={{ width: pageW, height: h, right: w * 0.08, zIndex: 1 }}
      />
      <div
        className="absolute rounded-l-sm bg-gradient-to-bl from-amber-700 to-amber-900 shadow-inner"
        style={{ width: pageW, height: h, left: w * 0.08, zIndex: 1 }}
      />

      {/* Right page — flips */}
      <motion.div
        className="absolute origin-left"
        style={{
          width: pageW,
          height: h * 0.92,
          top: h * 0.04,
          left: "50%",
          transformStyle: "preserve-3d",
          zIndex: 10,
        }}
        animate={{ rotateY: [0, -160, 0] }}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.5 }}
      >
        {/* Front of page */}
        <div
          className="absolute inset-0 rounded-r-sm bg-gradient-to-br from-amber-50 to-amber-100 shadow-md"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="h-full w-full flex items-center justify-center">
            <div className="w-[60%] space-y-[3px]">
              {[85, 92, 78, 95, 82].map((width, i) => (
                <div key={i} className="h-[1.5px] rounded-full bg-amber-300/50" style={{ width: `${width}%` }} />
              ))}
            </div>
          </div>
        </div>
        {/* Back of page */}
        <div
          className="absolute inset-0 rounded-l-sm bg-gradient-to-bl from-orange-50 to-amber-100/80"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="h-full w-full flex items-center justify-center">
            <div className="w-[60%] space-y-[3px]">
              {[70, 85, 60, 90].map((width, i) => (
                <div key={i} className="h-[1.5px] rounded-full bg-amber-300/40" style={{ width: `${width}%` }} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Left page — flips opposite */}
      <motion.div
        className="absolute origin-right"
        style={{
          width: pageW,
          height: h * 0.92,
          top: h * 0.04,
          right: "50%",
          transformStyle: "preserve-3d",
          zIndex: 8,
        }}
        animate={{ rotateY: [0, 160, 0] }}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.5, delay: 2.25 }}
      >
        <div
          className="absolute inset-0 rounded-l-sm bg-gradient-to-bl from-amber-50 to-amber-100 shadow-md"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="h-full w-full flex items-center justify-center">
            <div className="w-[60%] space-y-[3px]">
              {[70, 85, 90, 65, 80].map((width, i) => (
                <div key={i} className="h-[1.5px] rounded-full bg-amber-300/50" style={{ width: `${width}%` }} />
              ))}
            </div>
          </div>
        </div>
        <div
          className="absolute inset-0 rounded-r-sm bg-gradient-to-br from-orange-50 to-amber-100/80"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="h-full w-full flex items-center justify-center">
            <div className="w-[60%] space-y-[3px]">
              {[70, 85, 60, 90].map((width, i) => (
                <div key={i} className="h-[1.5px] rounded-full bg-amber-300/40" style={{ width: `${width}%` }} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ₹ symbol on the cover center */}
      <motion.span
        className="absolute z-20 font-black bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-600 bg-clip-text text-transparent drop-shadow-sm select-none"
        style={{ fontSize: size * 0.38, lineHeight: 1 }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        ₹
      </motion.span>
    </div>
  );
}
