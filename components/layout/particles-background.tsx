"use client";

import { motion } from "framer-motion";

export function ParticlesBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 bg-white/20 rounded-full absolute"
          style={{
            left: `${((i * 37) % 100)}%`,
            top: `${((i * 83) % 100)}%`
          }}
          animate={{ y: [0, -20, 0] }}
          transition={{
            duration: 3 + ((i * 13) % 4),
            repeat: Infinity,
            ease: "easeInOut",
            delay: (i * 7) % 2
          }}
        />
      ))}
    </div>
  );
}
