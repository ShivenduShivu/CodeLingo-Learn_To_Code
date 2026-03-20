"use client";

import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Star, Lock, Check, Crown, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Level } from "@/lib/supabase/queries";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { playLevelUpSound } from "@/lib/utils/sound";

export type LevelState = "locked" | "unlocked" | "completed" | "perfected";

interface LevelNodeProps {
  level: Level;
  state: LevelState;
  index: number;
}

export function LevelNode({
  level,
  state,
  index,
}: LevelNodeProps) {
  const alignments = ["self-center", "self-start", "self-end", "self-start"];
  const alignment = alignments[index % alignments.length];

  const isLocked = state === "locked";
  const isUnlocked = state === "unlocked";
  const isCompleted = state === "completed" || state === "perfected";
  const isJustCompleted = isUnlocked; // Since we don't have historical transitions, triggering wow effects natively tracking "Arrival Node" (unlocked) currently.

  const nodeRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [showXP, setShowXP] = useState(false);

  const controls = useAnimation();

  useEffect(() => {
    // If the URL contains ?completedLevelId=XYZ and this is the matching node, trigger float
    if (searchParams.get("completedLevelId") === level.id) {
      setShowXP(true);
      // Canvas Confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      // Screen Shake Element
      controls.start({
        x: [0, -8, 8, -5, 5, 0],
        transition: { duration: 0.5, ease: "easeInOut", delay: 0.2 }
      });
      try {
        playLevelUpSound();
      } catch (e) { }
      const t = setTimeout(() => setShowXP(false), 2000);
      return () => clearTimeout(t);
    }
  }, [searchParams, level.id, controls]);

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

  const Icon = isLocked ? Lock : isCompleted ? Check : Star;
  const isCheckpoint = (index + 1) % 5 === 0;

  const NodeInner = (
    <motion.div
      ref={nodeRef}
      whileHover={!isLocked ? { scale: 1.2, rotateY: 10 } : {}}
      whileTap={!isLocked ? { scale: 0.95 } : {}}
      animate={controls}
      transition={isCompleted ? { duration: 0.6, ease: "easeOut" } : { type: "spring", stiffness: 200, damping: 15 }}
      className="relative group flex flex-col items-center hover:shadow-2xl transition-all"
    >
      {isCheckpoint && (
        <motion.div
          className="absolute -top-10 text-4xl drop-shadow-xl z-20"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          🏁
        </motion.div>
      )}
      <div
        className={cn(
          "relative z-10 rounded-full flex flex-col items-center justify-center border-b-8 transition-shadow",
          isCheckpoint ? "w-28 h-28" : "w-24 h-24",
          bgColor,
          borderColor,
          isLocked && "bg-gray-300 opacity-50 cursor-not-allowed",
          isUnlocked && "bg-yellow-400 scale-125 ring-4 ring-yellow-300 shadow-[0_0_20px_rgba(255,215,0,0.8)] animate-bounce",
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
          <>
            {/* Pulse Burst Under Node */}
            <motion.div
              className="absolute w-32 h-32 bg-yellow-300 rounded-full blur-xl pointer-events-none z-0"
              animate={{ scale: [0, 2], opacity: [0.8, 0] }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            {/* Scale Pop Up Arriving Details */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1, y: -50 }}
              exit={{ opacity: 0, y: -70 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute top-0 text-yellow-500 font-bold text-2xl drop-shadow-md z-50 pointer-events-none whitespace-nowrap"
            >
              + {level.xp_reward} XP
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Static Label Below Node */}
      <div className="text-xs text-muted-foreground text-center mt-2 font-bold max-w-[120px]">
        {level.title}
        {isUnlocked && <div className="text-[10px] text-yellow-600 font-extrabold uppercase mt-1 animate-pulse tracking-widest">Start Here</div>}
      </div>

      {/* Floating Tooltip Label */}
      <div className="absolute top-full mt-8 bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-xl shadow-2xl border border-white/10 text-xs font-bold text-white pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap left-1/2 -translate-x-1/2">
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
