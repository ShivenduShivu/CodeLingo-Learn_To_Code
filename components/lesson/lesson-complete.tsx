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
    <div className="flex flex-col items-center justify-center min-h-screen relative z-50 p-6">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="text-center space-y-6 max-w-lg mb-20 w-full"
      >
        <div className="w-32 h-32 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-8 shadow-xl shadow-green-500/20">
          <span className="text-6xl">🎉</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white">Level Complete</h1>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-4 mt-8"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center shadow-xl">
            <div className="text-white/70 text-sm font-bold uppercase mb-1">XP</div>
            <motion.div 
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="text-xp font-black text-2xl h-8 flex items-center"
            >
              +{xp}
            </motion.div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center shadow-xl">
            <div className="text-white/70 text-sm font-bold uppercase mb-1">Stars</div>
            <div className="flex gap-1 h-8 items-center justify-center">
              {stars > 0 ? (
                Array.from({ length: stars }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 + (i * 0.2) }}
                    className="text-2xl"
                  >
                    ⭐
                  </motion.span>
                ))
              ) : (
                <span className="text-muted-foreground text-lg font-bold">0</span>
              )}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center shadow-xl">
            <div className="text-white/70 text-sm font-bold uppercase mb-1">Streak</div>
            <motion.div 
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.8 }}
              className="text-orange-500 font-black text-2xl h-8 flex items-center"
            >
              {streak}🔥
            </motion.div>
          </div>
        </motion.div>

        {/* Achievement Unlocks Section */}
        {achievements && achievements.length > 0 && (
          <AchievementPopup achievements={achievements} />
        )}

        <div className="pt-12">
             <Link href={`/tracks/${trackId}`}>
               <Button className="w-full py-6 text-xl font-bold bg-emerald-500 hover:bg-emerald-400 rounded-2xl border border-white/20 text-white">
                 Continue Learning &rarr;
               </Button>
             </Link>
        </div>
        
      </motion.div>
    </div>
  );
}
