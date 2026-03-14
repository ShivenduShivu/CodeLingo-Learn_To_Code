"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AchievementPopup } from "@/components/gamification/achievement-popup";
import type { UnlockEvent } from "@/lib/achievements/evaluator";
import Link from "next/link";

interface LessonCompleteProps {
  xp: number;
  stars: number;
  streak: number;
  achievements?: UnlockEvent[];
  trackId: string;
}

export function LessonComplete({ xp, stars, streak, achievements, trackId }: LessonCompleteProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative z-50 p-6">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="text-center space-y-6 max-w-lg mb-20 w-full"
      >
        <div className="w-32 h-32 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-8 shadow-xl shadow-green-500/20">
          <span className="text-6xl">🎉</span>
        </div>
        <h1 className="text-4xl font-extrabold text-foreground">Level Complete</h1>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-4 mt-8"
        >
          <div className="bg-card border-2 border-border border-b-4 rounded-xl p-4">
            <div className="text-muted-foreground text-sm font-bold uppercase mb-1">XP</div>
            <div className="text-xp font-black text-2xl">+{xp}</div>
          </div>
          <div className="bg-card border-2 border-border border-b-4 rounded-xl p-4">
            <div className="text-muted-foreground text-sm font-bold uppercase mb-1">Stars</div>
            <div className="text-primary font-black text-2xl">+{stars}</div>
          </div>
          <div className="bg-card border-2 border-border border-b-4 rounded-xl p-4">
            <div className="text-muted-foreground text-sm font-bold uppercase mb-1">Streak</div>
            <div className="text-orange-500 font-black text-2xl">{streak}🔥</div>
          </div>
        </motion.div>

        {/* Achievement Unlocks Section */}
        {achievements && achievements.length > 0 && (
          <AchievementPopup achievements={achievements} />
        )}

        <div className="pt-12">
           <Link href={`/tracks/${trackId}`}>
             <Button className="w-full py-6 text-xl font-bold bg-primary hover:bg-primary/90 rounded-2xl border-b-4 border-primary-foreground/20">
               Continue Learning &rarr;
             </Button>
           </Link>
        </div>
        
      </motion.div>
    </div>
  );
}
