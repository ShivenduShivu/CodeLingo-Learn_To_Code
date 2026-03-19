"use client";

import { motion } from "framer-motion";
import { Star, Lock, Check, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Level } from "@/lib/supabase/queries";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";

export type LevelState = "locked" | "unlocked" | "completed" | "perfected";

interface LevelNodeProps {
  level: Level;
  state: LevelState;
  index: number;
}

export function LevelNode({ level, state, index }: LevelNodeProps) {
  const alignments = ["self-center", "self-start", "self-end", "self-start"];
  const alignment = alignments[index % alignments.length];

  const isLocked = state === "locked";
  const isUnlocked = state === "unlocked";
  const isCompleted = state === "completed" || state === "perfected";

  const nodeRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [showXP, setShowXP] = useState(false);

  useEffect(() => {
    // If the URL contains ?completedLevelId=XYZ and this is the matching node, trigger float
    if (searchParams.get("completedLevelId") === level.id) {
       setShowXP(true);
       const t = setTimeout(() => setShowXP(false), 2000);
       return () => clearTimeout(t);
    }
  }, [searchParams, level.id]);

  useEffect(() => {
    if (isUnlocked && nodeRef.current) {
      setTimeout(() => {
        nodeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }
  }, [isUnlocked]);

  let bgColor = "bg-muted-foreground/20";
  let borderColor = "border-muted-foreground/30";
  let iconColor = "text-muted-foreground/50";

  if (isUnlocked) {
    bgColor = "bg-yellow-400";
    borderColor = "border-yellow-500 border-b-yellow-600";
    iconColor = "text-yellow-950";
  } else if (isCompleted) {
    bgColor = "bg-green-500";
    borderColor = "border-green-600 border-b-green-700";
    iconColor = "text-white";
  }

  const NodeInner = (
    <motion.div
      ref={nodeRef}
      whileHover={!isLocked ? { scale: 1.1 } : {}}
      whileTap={!isLocked ? { scale: 0.95 } : {}}
      animate={isCompleted ? { scale: [1, 1.3, 1] } : {}}
      transition={isCompleted ? { duration: 0.6, ease: "easeOut" } : {}}
      className="relative group flex flex-col items-center hover:shadow-lg transition-all"
    >
      <div
        className={cn(
          "relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center border-b-8 transition-shadow",
          bgColor,
          borderColor,
          isLocked && "bg-gray-300 opacity-50 cursor-not-allowed",
          isUnlocked && "bg-yellow-400 scale-125 ring-4 ring-yellow-300 animate-bounce shadow-xl",
          !isLocked && "cursor-pointer"
        )}
      >
        {state === "locked" && <Lock className={cn("w-10 h-10", iconColor)} />}
        {state === "unlocked" && <Star className={cn("w-10 h-10 fill-current", iconColor)} />}
        {state === "completed" && <Check className={cn("w-10 h-10 text-white font-extrabold")} />}
        {state === "perfected" && <Crown className={cn("w-10 h-10 fill-current", iconColor)} />}
      </div>

      <AnimatePresence>
        {showXP && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -40, scale: 1.2 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-0 text-amber-500 font-extrabold text-2xl drop-shadow-md z-50 pointer-events-none"
          >
            +{level.xp_reward} XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* Static Label Below Node */}
      <div className="text-xs text-muted-foreground text-center mt-2 font-bold max-w-[120px]">
        {level.title}
        {isUnlocked && <div className="text-[10px] text-yellow-600 font-extrabold uppercase mt-1 animate-pulse tracking-widest">Start Here</div>}
      </div>

      {/* Floating Tooltip Label */}
      <div className="absolute top-full mt-8 bg-card px-3 py-1.5 rounded-lg shadow-md border-2 border-border text-xs font-bold text-foreground pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap left-1/2 -translate-x-1/2">
        {isLocked ? "Complete previous level to unlock" : `${level.xp_reward} XP Reward`}
      </div>
    </motion.div>
  );

  const wrapperClass = cn("relative flex justify-center my-6 w-fit z-10", alignment);

  if (isLocked) {
    return <div className={wrapperClass}>{NodeInner}</div>;
  }

  // If unlocked or completed, make it a clickable Link to the actual lesson
  return (
    <Link href={`/levels/${level.id}`} className={wrapperClass}>
      {NodeInner}
    </Link>
  );
}
