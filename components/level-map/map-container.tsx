"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface MapContainerProps {
  children: ReactNode;
  progressPercentage?: number;
}

import { useState } from "react";

export function MapContainer({ children, progressPercentage = 0 }: { children: ReactNode, progressPercentage?: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <div
      className="w-full min-h-screen overflow-hidden relative group"
      style={{ transform: `perspective(1200px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` }}
      onMouseMove={(e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        setTilt({ x, y });
      }}
    >
      {/* 3. Parallax Background */}
      <div className="absolute inset-0 -z-10">
        {/* Layer 1: Linear Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-green-50 to-emerald-100" />
        {/* Layer 2: Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.15),transparent_60%)] z-0" />
        {/* Layer 3: Moving Particles Grid */}
        <motion.div
          className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_2px,transparent_2px)] bg-[length:24px_24px] z-10"
          animate={{ y: progressPercentage * 5 }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
        />
      </div>
      {/* Floating Particles Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 20 }).map((_, i) => {
          // Deterministic values mapped to index to prevent NextJS React SSR hydration mismatches
          const leftPos = (i * 37) % 100;
          const startY = 800 + ((i * 101) % 400);
          const startOpacity = 0.2 + ((i * 13) % 50) / 100;
          const duration = 6 + ((i * 47) % 6);
          const delay = (i * 17) % 5;

          return (
            <motion.div
              key={i}
              className="w-2 h-2 bg-green-300 rounded-full absolute"
              style={{ left: `${leftPos}%` }}
              initial={{ y: startY, opacity: startOpacity }}
              animate={{ y: -100 }}
              transition={{
                duration: duration,
                delay: delay,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          );
        })}
      </div>

      <motion.div
        className="w-full h-full relative flex flex-col items-center z-10 pt-16 pb-32"
        animate={{ y: `-${progressPercentage * 10}px` }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
