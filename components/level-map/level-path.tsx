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

        return (
          <LevelNode 
            key={level.id} 
            level={level} 
            state={state} 
            index={index} 
          />
        );
      })}
    </div>
  );
}
