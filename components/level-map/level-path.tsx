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
  let d = "M150 50";
  const segments = Math.max(1, Math.ceil(levelsCount / 2));
  for(let i=0; i<segments; i++) {
    const y0 = 50 + i * 300;
    const y1 = y0 + 300;
    if (i % 2 === 0) {
      d += ` C50 ${y0 + 100}, 250 ${y0 + 200}, 150 ${y1}`;
    } else {
      d += ` C250 ${y0 + 100}, 50 ${y0 + 200}, 150 ${y1}`;
    }
  }
  return d;
}

const getNodePos = (index: number) => {
  const y = 50 + index * 150;
  let x = 150;
  if (index % 2 !== 0) {
    const segmentIndex = Math.floor(index / 2);
    x = segmentIndex % 2 === 0 ? 80 : 220; 
  }
  return { x, y };
};

export function LevelPath({ levels, currentLevelNumber, progressPercentage = 0 }: LevelPathProps) {
  const pathString = generatePath(levels.length);
  const totalHeight = 50 + Math.max(1, Math.ceil(levels.length / 2)) * 300 + 100;

  return (
    <div className="relative w-[300px] mx-auto overflow-visible pb-32" style={{ height: `${totalHeight}px` }}>
      {/* SVG Track */}
      <svg width="300" height={totalHeight} viewBox={`0 0 300 ${totalHeight}`} className="absolute top-0 left-0 pointer-events-none z-0" style={{ filter: "drop-shadow(0 0 8px rgba(34,197,94,0.4))" }}>
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
      <motion.div
        className="absolute z-30 drop-shadow-2xl flex items-center justify-center -ml-8 -mt-8"
        style={{
          offsetPath: `path('${pathString}')`,
          offsetRotate: "auto"
        } as any}
        animate={{
          offsetDistance: `${progressPercentage}%`,
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 2.5, 
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

      {/* Level Nodes Mapping */}
      {levels.map((level, index) => {
        let state: LevelState = "locked";
        
        if (level.level_number < currentLevelNumber) {
          state = "completed"; 
        } else if (level.level_number === currentLevelNumber) {
          state = "unlocked";
        }

        const { x, y } = getNodePos(index);

        return (
          <div 
            key={level.id} 
            className="absolute z-10"
            style={{ 
              top: `${y}px`, 
              left: `${x}px`,
              transform: "translate(-50%, -50%)"
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
