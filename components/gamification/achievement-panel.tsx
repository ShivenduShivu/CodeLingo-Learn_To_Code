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
      <h2 className="text-white font-semibold text-lg flex items-center gap-2">
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
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2 hover:scale-[1.03] transition-all duration-300 cursor-pointer text-white shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
          >
            <div className="text-4xl bg-white/5 p-3 rounded-full">{ach.icon || "🏆"}</div>
            <div className="font-semibold text-white">{ach.name}</div>
            <div className="text-xs text-white/70 line-clamp-2">{ach.description}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
