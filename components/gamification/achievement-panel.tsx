"use client";

import { Trophy } from "lucide-react";
import type { Achievement } from "@/lib/supabase/queries";
import { motion } from "framer-motion";

export function AchievementPanel({ achievements }: { achievements: Achievement[] }) {
  if (!achievements || achievements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" />
        Your Achievements
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {achievements.map((ach, index) => (
          <motion.div 
            key={ach.id} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border-2 border-border border-b-4 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2 hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <div className="text-4xl bg-muted/30 p-3 rounded-full">{ach.icon || "🏆"}</div>
            <div className="font-bold text-foreground">{ach.name}</div>
            <div className="text-xs text-muted-foreground line-clamp-2">{ach.description}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
