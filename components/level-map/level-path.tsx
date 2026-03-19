"use client";

import { type Level } from "@/lib/supabase/queries";
import { LevelNode, type LevelState } from "./level-node";

interface LevelPathProps {
  levels: Level[];
  currentLevelNumber: number;
}

export function LevelPath({ levels, currentLevelNumber }: LevelPathProps) {
  return (
    <div className="flex flex-col-reverse items-center justify-end py-12 relative w-full">
      {/* Background connector line to be added in future iterations if desired */}
      
      {levels.map((level, index) => {
        let state: LevelState = "locked";
        
        if (level.level_number < currentLevelNumber) {
          state = "completed"; // Could be perfected based on a stars column later
        } else if (level.level_number === currentLevelNumber) {
          state = "unlocked";
        }

        // Generic Section Groupings based on typical programming curricula architectures
        const sections = ["Variables & Logic", "Loops & Control Flow", "Functions & Scopes", "Data Structures", "Advanced Algorithms", "Mastery"];
        const sectionIndex = Math.floor(index / 3);
        const isFirstInSection = index % 3 === 0;

        return (
          <div key={level.id} className="w-full flex flex-col items-center">
             <LevelNode 
               level={level} 
               state={state} 
               index={index} 
             />
             {isFirstInSection && (
               <div className="text-xs text-muted-foreground uppercase tracking-wide font-extrabold my-8 bg-card px-4 py-1 rounded-full border border-border/50 relative z-10 shadow-sm">
                 {sections[Math.min(sectionIndex, sections.length - 1)]}
               </div>
             )}
          </div>
        );
      })}
    </div>
  );
}
