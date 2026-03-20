"use client";

import { type Level } from "@/lib/supabase/queries";
import { LevelNode, type LevelState } from "./level-node";
import { motion } from "framer-motion";

interface LevelPathProps {
  levels: Level[];
  currentLevelNumber: number;
  progressPercentage?: number;
}

function generatePath(levelsCount: number) {
  let d = "M100 0";
  for (let i = 0; i < levelsCount; i++) {
    const y0 = i * 160;
    const y1 = (i + 1) * 160;
    const controlX = i % 2 === 0 ? 0 : 200;
    d += ` Q ${controlX} ${y0 + 80}, 100 ${y1}`;
  }
  return d;
}

export function LevelPath({ levels, currentLevelNumber, progressPercentage = 0 }: LevelPathProps) {
  const pathString = generatePath(levels.length);
  const totalHeight = levels.length * 160;

  return (
    <div className="relative w-full overflow-visible" style={{ height: `${totalHeight}px` }}>
      {/* SVG Track */}
      <svg width="200" height={totalHeight} viewBox={`0 0 200 ${totalHeight}`} className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-0" style={{ filter: "drop-shadow(0 0 8px rgba(34,197,94,0.4))" }}>
        {/* Road Depth Background */}
        <path
          d={pathString}
          stroke="#14532d"
          strokeWidth="20"
          strokeLinecap="round"
          fill="none"
          className="opacity-20"
        />
        <path
          d={pathString}
          stroke="#16a34a"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          className="opacity-20"
        />
        <motion.path
          d={pathString}
          stroke="#22c55e"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="10 10"
          fill="none"
          style={{
            filter: "drop-shadow(0px 0px 8px #22c55e)"
          }}
          animate={{
            strokeDashoffset: [0, -20]
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear"
          }}
        />
      </svg>

      {/* The Animated Car with Trail */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] z-30 drop-shadow-2xl pointer-events-none" style={{ height: `${totalHeight}px` }}>
        <motion.div
          className="absolute top-0 left-0 flex items-center justify-center -ml-7 -mt-7 pointer-events-auto"
          style={{
            offsetPath: `path('${pathString}')`,
            offsetRotate: "auto"
          } as unknown as React.CSSProperties}
          animate={{
            offsetDistance: ["0%", `${progressPercentage}%`],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 3, 
            ease: [0.22, 1, 0.36, 1]
          }}
        >
        {/* Trail Effect */}
        <motion.div
          className="absolute w-10 h-3 bg-green-400 blur-md rounded-full -z-10 translate-y-4"
          animate={{ opacity: [0.8, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
        <motion.img
          src="/car.svg"
          className="w-16 cursor-pointer"
          whileHover={{ scale: 1.1, rotate: 5 }}
        />
      </motion.div>
      </div>

      {/* Level Nodes Mapping */}
      {levels.map((level, index) => {
        let state: LevelState = "locked";
        
        if (level.level_number < currentLevelNumber) {
          state = "completed"; 
        } else if (level.level_number === currentLevelNumber) {
          state = "unlocked";
        }

        return (
          <div 
            key={level.id} 
            className="absolute left-1/2 -translate-x-1/2 z-10"
            style={{ 
              top: `${index * 160}px`
            }}
          >
             <LevelNode 
               level={level} 
               state={state} 
               index={index} 
             />
          </div>
        );
      })}
    </div>
  );
}
