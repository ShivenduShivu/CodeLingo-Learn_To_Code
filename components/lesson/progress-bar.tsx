"use client";

import { motion } from "framer-motion";
import { useLessonStore } from "@/lib/store/useLessonStore";
import { X, Heart } from "lucide-react";
import Link from "next/link";

interface ProgressBarProps {
  trackId: string; // To return to the map
}

export function ProgressBar({ trackId }: ProgressBarProps) {
  const { lessonProgress, hearts } = useLessonStore();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40 pb-4 pt-6 px-4 md:px-8">
      <div className="max-w-4xl mx-auto flex items-center gap-4 md:gap-8">
        {/* Exit Button */}
        <Link 
          href={`/tracks/${trackId}`}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
        >
          <X className="w-6 h-6 stroke-[3]" />
        </Link>

        {/* The Bar */}
        <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-xp rounded-full flex items-center justify-end px-2"
            initial={{ width: 0 }}
            animate={{ width: `${lessonProgress}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.8 }}
          >
             {/* Shine effect inside the bar */}
             <div className="w-full h-1/3 bg-white/20 rounded-full mb-1" />
          </motion.div>
        </div>

        {/* Hearts Indicator */}
        <div className="flex items-center gap-2 font-bold text-destructive">
          <Heart className="w-6 h-6 fill-current" />
          <span className="text-lg">{hearts}</span>
        </div>
      </div>
    </header>
  );
}
