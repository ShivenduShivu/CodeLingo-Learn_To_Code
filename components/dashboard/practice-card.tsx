"use client";

import { useEffect, useState } from "react";
import { getWeakLessons } from "@/lib/utils/practice-detector";
import { Button } from "@/components/ui/button";
import { Target, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { LessonAttemptTracker } from "@/lib/utils/practice-detector";

export function PracticeCard() {
  const [weakLessons, setWeakLessons] = useState<LessonAttemptTracker[]>([]);

  useEffect(() => {
     // Pull dynamic localStorage data on client mount mapping
     setWeakLessons(getWeakLessons());
  }, []);

  if (weakLessons.length === 0) return null;

  // Render the most recent/relevant weak lesson first
  const targetLesson = weakLessons[weakLessons.length - 1];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
        className="w-full mb-8 mt-8"
      >
        <h2 className="text-white text-lg font-semibold tracking-wide mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-500" />
            Practice Weak Skills
        </h2>
        
        <div className="bg-yellow-400/10 border border-yellow-300/40 rounded-2xl p-4 backdrop-blur-lg shadow-[0_0_50px_rgba(250,204,21,0.4)] animate-pulse transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-white/90 font-medium text-lg">
                   Practice {targetLesson.lessonTitle || "Recent Topics"} Again
                </h3>
                <p className="text-sm text-white/70">
                   Improve your understanding and earn +10 bonus XP!
                </p>
             </div>
             
             {/* Append a special param ?practice=true to inform the lesson runner */}
             <Link href={`/lessons/${targetLesson.lessonId}?practice=true`} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white shadow-sm font-bold flex items-center justify-center gap-2 rounded-xl">
                   Start Practice
                   <ArrowRight className="w-4 h-4" />
                </Button>
             </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
