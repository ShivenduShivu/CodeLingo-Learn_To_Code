"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface MapContainerProps {
  children: ReactNode;
  progressPercentage?: number;
}

import { useEffect } from "react";

export function MapContainer({ children, progressPercentage = 0, xp = 0, streak = 0, levelsCount = 1 }: { children: ReactNode, progressPercentage?: number, xp?: number, streak?: number, levelsCount?: number }) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-emerald-50 to-green-100 relative overflow-hidden">
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
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {Array.from({ length: 20 }).map((_, i) => {
          const leftPos = (i * 37) % 100;
          const startY = 800 + ((i * 101) % 400);
          const startOpacity = 0.2 + ((i * 13) % 50) / 100;
          const duration = 6 + ((i * 47) % 6);
          const delay = (i * 17) % 5;

          return (
            <motion.div
              key={`particle-${i}`}
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

      {/* SCROLLABLE WORLD CONTAINER */}
      <div className="relative mx-auto max-w-md py-20 z-20">
        {/* Floating Environment Objects */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {Array.from({ length: 15 }).map((_, i) => {
            const decoration = i % 3 === 0 ? "🌴" : i % 3 === 1 ? "🌲" : "⛰️";
            const topPercent = ((i * 73) % 90) + 5;
            const leftPercent = ((i * 17) % 80) + 10;
            const size = i % 2 === 0 ? "text-4xl" : "text-3xl";

            return (
              <div
                key={`env-${i}`}
                className={`absolute ${size} drop-shadow-lg`}
                style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
              >
                <div className="animate-bounce" style={{ animationDuration: `${3 + (i % 3)}s` }}>{decoration}</div>
              </div>
            );
          })}
        </div>

        {children}
      </div>
    </div>
  );
}
