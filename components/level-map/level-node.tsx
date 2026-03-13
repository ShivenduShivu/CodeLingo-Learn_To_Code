"use client";

import { motion } from "framer-motion";
import { Star, Lock, Check, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Level } from "@/lib/supabase/queries";
import Link from "next/link";

export type LevelState = "locked" | "unlocked" | "completed" | "perfected";

interface LevelNodeProps {
  level: Level;
  state: LevelState;
  index: number;
}

export function LevelNode({ level, state, index }: LevelNodeProps) {
  // Classic Duolingo sine wave offset for vertical visual pacing
  const offsets = [0, 40, 60, 40, 0, -40, -60, -40];
  const offset = offsets[index % offsets.length];

  const isLocked = state === "locked";
  const isUnlocked = state === "unlocked";
  const isCompleted = state === "completed" || state === "perfected";

  let bgColor = "bg-muted-foreground/20";
  let borderColor = "border-muted-foreground/30";
  let iconColor = "text-muted-foreground/50";

  if (isUnlocked) {
    bgColor = "bg-primary";
    borderColor = "border-primary/80 border-b-primary";
    iconColor = "text-primary-foreground";
  } else if (isCompleted) {
    bgColor = "bg-xp";
    borderColor = "border-xp/80 border-b-[#E3A000]"; // Deeper gold for the 3D bottom border
    iconColor = "text-xp-foreground";
  }

  const NodeContent = (
    <div
      className="relative flex justify-center w-full my-8 group"
      style={{ transform: `translateX(${offset}px)` }}
    >
      <motion.div
        whileHover={!isLocked ? { scale: 1.1 } : {}}
        whileTap={!isLocked ? { scale: 0.95 } : {}}
      >
        <div
          className={cn(
            "relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center border-b-8 transition-shadow",
            bgColor,
            borderColor,
            isLocked && "opacity-80 cursor-not-allowed",
            isUnlocked && "hover:shadow-2xl shadow-primary/40 ring-4 ring-primary/20",
            !isLocked && "cursor-pointer"
          )}
        >
          {state === "locked" && <Lock className={cn("w-8 h-8", iconColor)} />}
          {state === "unlocked" && <Star className={cn("w-8 h-8 fill-current", iconColor)} />}
          {state === "completed" && <Check className={cn("w-8 h-8", iconColor, "font-extrabold")} />}
          {state === "perfected" && <Crown className={cn("w-8 h-8 fill-current", iconColor)} />}
        </div>
      </motion.div>

      {/* Floating Tooltip Label */}
      <div className="absolute top-full mt-4 bg-card px-4 py-2 rounded-xl shadow-lg border-2 border-border text-sm font-bold text-foreground pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
        {level.title}
        <div className="text-xs text-muted-foreground font-medium mt-1">
          {isLocked ? "Complete previous levels to unlock" : `${level.xp_reward} XP Reward`}
        </div>
      </div>
    </div>
  );

  if (isLocked) {
    return NodeContent;
  }

  // If unlocked or completed, make it a clickable Link to the actual lesson
  return (
    <Link href={`/levels/${level.id}`} className="block w-full">
      {NodeContent}
    </Link>
  );
}
