"use client";

import { motion } from "framer-motion";
import type { UnlockEvent } from "@/lib/achievements/evaluator";

interface AchievementPopupProps {
  achievements: UnlockEvent[];
}

export function AchievementPopup({ achievements }: AchievementPopupProps) {
  if (!achievements || achievements.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-8 space-y-3 w-full"
    >
      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 text-center">New Achievements Unlocked!</h3>
      {achievements.map((unlock, i) => (
        <motion.div 
          key={unlock.achievement.id}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7 + (i * 0.2) }}
          className="bg-primary/10 border-2 border-primary/20 rounded-2xl p-4 flex items-center gap-4 text-left"
        >
          <div className="text-4xl bg-background rounded-full w-14 h-14 flex items-center justify-center shadow-sm shrink-0">
            {unlock.achievement.icon}
          </div>
          <div className="flex flex-col flex-1">
            <span className="font-extrabold text-primary">{unlock.achievement.name}</span>
            <span className="text-sm text-muted-foreground">{unlock.achievement.description}</span>
          </div>
          {unlock.achievement.xp_reward > 0 && (
            <div className="bg-primary text-primary-foreground font-bold px-3 py-1 rounded-full text-sm shrink-0">
              +{unlock.achievement.xp_reward} XP
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
