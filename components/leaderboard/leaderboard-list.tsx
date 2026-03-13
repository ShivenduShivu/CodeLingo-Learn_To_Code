"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { UserLeaderboard } from "@/lib/supabase/queries";
import { Crown, Medal } from "lucide-react";

interface LeaderboardListProps {
  players: UserLeaderboard[];
  currentUserId?: string;
}

export function LeaderboardList({ players, currentUserId }: LeaderboardListProps) {
  if (players.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <p>No players found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3">
      {players.map((player, index) => {
        const isCurrentUser = player.id === currentUserId;
        const rank = index + 1;
        
        // Gamified styling based on podium placement
        let rankColor = "text-slate-400";
        let bgStyle = "bg-slate-50 border-slate-100 hover:bg-slate-100";
        let icon = null;

        if (rank === 1) {
          rankColor = "text-yellow-500";
          bgStyle = "bg-yellow-50/50 border-yellow-200 shadow-sm hover:bg-yellow-100/50";
          icon = <Crown className="w-5 h-5 text-yellow-500 mr-2 shrink-0" />;
        } else if (rank === 2) {
          rankColor = "text-slate-500";
          bgStyle = "bg-slate-50/50 border-slate-200 shadow-sm hover:bg-slate-100/50";
          icon = <Medal className="w-5 h-5 text-slate-400 mr-2 shrink-0" />;
        } else if (rank === 3) {
          rankColor = "text-amber-700";
          bgStyle = "bg-orange-50/30 border-orange-200 shadow-sm hover:bg-orange-100/30";
          icon = <Medal className="w-5 h-5 text-amber-600 mr-2 shrink-0" />;
        }

        if (isCurrentUser) {
          bgStyle += " ring-2 ring-primary bg-primary/5 hover:bg-primary/10";
        }

        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={player.id}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${bgStyle}`}
          >
            <div className="flex items-center gap-4">
              <div className={`font-bold w-6 text-center ${rankColor}`}>
                {rank}
              </div>
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-slate-200 shrink-0">
                <Image 
                  src={player.avatar_url || "https://api.dicebear.com/7.x/bottts/svg?seed=fallback"} 
                  alt={player.username}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-700 leading-tight flex items-center">
                  {player.username} {isCurrentUser && <span className="ml-2 text-[10px] uppercase tracking-wider bg-primary/20 text-indigo-700 px-2 py-0.5 rounded-full">You</span>}
                </span>
              </div>
            </div>

            <div className="flex items-center text-right font-black text-slate-700 whitespace-nowrap">
              {icon}
              {player.total_xp.toLocaleString()} <span className="text-xs text-muted-foreground ml-1">XP</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
