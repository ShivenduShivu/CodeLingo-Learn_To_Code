"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CourseList } from "@/components/course/course-list";
import { AchievementPanel } from "@/components/gamification/achievement-panel";
import type { Course, CourseProgressSummary, UserStats, DailyStats, Achievement } from "@/lib/supabase/queries";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

interface DashboardContentProps {
  enrolledCourses: Course[];
  enrolledIds: string[];
  courseProgressMap: Record<string, CourseProgressSummary>;
  userStats: UserStats;
  dailyStats: DailyStats;
  achievements: Achievement[];
}

export function DashboardContent({ 
  enrolledCourses, 
  enrolledIds, 
  courseProgressMap, 
  userStats, 
  dailyStats, 
  achievements 
}: DashboardContentProps) {
  const dailyGoalTarget = 5;
  const dailyGoalPercent = Math.min(Math.round((dailyStats.lessonsCompletedToday / dailyGoalTarget) * 100), 100);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto p-6 md:p-12 space-y-10"
    >
      {/* 1. HERO TEXT */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          What would you like to learn today?
        </h1>
        <p className="text-muted-foreground text-lg mt-2 font-medium">
          Continue your coding journey and keep your streak alive.
        </p>
      </motion.div>

      {/* 2. STATS OVERVIEW */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Daily Goal Card */}
        <div className="md:col-span-2 bg-card rounded-xl border-2 border-border p-6 flex flex-col justify-center relative overflow-hidden group hover:scale-[1.03] hover:shadow-lg hover:shadow-green-200 transition-all duration-200 cursor-pointer shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              🎯 Daily Goal
            </h3>
            <span className="text-sm font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {dailyStats.lessonsCompletedToday} / {dailyGoalTarget} Lessons
            </span>
          </div>
          <div className="h-4 w-full bg-muted rounded-full overflow-hidden relative border border-border">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${dailyGoalPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-green-500 rounded-full"
            />
            {dailyGoalPercent === 100 && (
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            )}
          </div>
          <div className="text-right text-xs text-muted-foreground font-medium mt-2">
            {dailyGoalPercent}% Complete
          </div>
        </div>

        {/* XP Today */}
        <div className="bg-card rounded-xl border-2 border-border p-6 flex flex-col items-center justify-center hover:scale-[1.03] hover:shadow-lg hover:shadow-yellow-200 transition-all duration-200 cursor-pointer shadow-md">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-xl font-black text-yellow-500">{dailyStats.xpEarnedToday} XP Today</div>
        </div>
        
        {/* Streak */}
        <div className="bg-card rounded-xl border-2 border-border p-6 flex flex-col items-center justify-center hover:scale-[1.03] hover:shadow-lg hover:shadow-orange-200 transition-all duration-200 cursor-pointer shadow-md">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-xl font-black text-orange-500">{userStats.streak} Day Streak</div>
        </div>
      </motion.div>

      {/* 3. ACHIEVEMENTS */}
      <motion.div variants={itemVariants}>
        <AchievementPanel achievements={achievements} />
      </motion.div>

      {/* 4. COURSE LIST */}
      <motion.div variants={itemVariants}>
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center space-y-6 shadow-sm hover:scale-[1.01] hover:shadow-lg transition-all duration-200">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              🚀 Start Your Coding Journey
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Pick a course to begin learning.
            </p>
            <Link href="/courses">
              <Button size="lg" className="px-8 py-6 text-xl rounded-2xl border-b-4 bg-primary hover:bg-primary/90 border-primary-foreground/20">
                Explore Courses &rarr;
              </Button>
            </Link>
          </div>
        ) : (
          <CourseList 
             courses={enrolledCourses} 
             enrolledIds={enrolledIds} 
             courseProgressMap={courseProgressMap}
             emptyMessage=""
             emptySubMessage=""
          />
        )}
      </motion.div>
    </motion.div>
  );
}
