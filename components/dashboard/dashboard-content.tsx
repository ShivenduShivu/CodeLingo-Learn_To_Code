"use client";

import { motion, useMotionValue, animate, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CourseList } from "@/components/course/course-list";
import { AchievementPanel } from "@/components/gamification/achievement-panel";
import { PracticeCard } from "@/components/dashboard/practice-card";
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
  userRank: number;
  lessonsToTop5: number;
}

export function DashboardContent({ 
  enrolledCourses, 
  enrolledIds, 
  courseProgressMap, 
  userStats, 
  dailyStats, 
  achievements,
  userRank,
  lessonsToTop5
}: DashboardContentProps) {
  const dailyGoalTarget = 5;
  const dailyGoalPercent = Math.min(Math.round((dailyStats.lessonsCompletedToday / dailyGoalTarget) * 100), 100);

  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, userStats.totalXp, { duration: 2, ease: "easeOut" });
    return animation.stop;
  }, [userStats.totalXp, count]);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="relative min-h-screen overflow-hidden"
    >
      {/* BASE GRADIENT */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-green-900 via-black to-blue-950" />

      {/* GRID LAYER */}
      <div className="absolute inset-0 z-5 opacity-5 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* FLOATING PARTICLES */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute w-20 h-20 bg-green-400/30 rounded-full blur-xl top-10 right-20" />
        <div className="absolute w-16 h-16 bg-white/20 rounded-full blur-lg bottom-20 left-40" />
      </div>

      {/* MAIN CONTENT */}
      <div 
        onMouseMove={(e) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 8;
          const y = (e.clientY / window.innerHeight - 0.5) * 8;
          e.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
        }}
        className="relative z-30 transition-transform duration-200 max-w-6xl mx-auto p-6 md:p-12 space-y-10"
      >
      {/* 1. HERO TEXT & CTA */}
      <motion.div variants={itemVariants} className="relative text-center mb-10 z-10">
        <div className="absolute w-64 h-64 bg-green-400/20 blur-3xl rounded-full left-1/2 -translate-x-1/2 top-0 pointer-events-none" />
        <h1 className="text-4xl font-bold text-white tracking-tight">
          What will you conquer today?
        </h1>
        <p className="text-white/70 mt-2">
          Build your streak. Master coding daily.
        </p>
        
        <Link href="/courses" className="relative z-10 inline-block">
          <button className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-lg hover:scale-105 transition">
            Continue Learning →
          </button>
        </Link>
      </motion.div>

      {/* 2. STATS OVERVIEW */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Daily Goal Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-100 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:opacity-100 flex flex-col justify-center relative overflow-hidden group cursor-pointer text-white scale-95 opacity-90">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              🎯 Daily Goal
            </h3>
          </div>
          <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${dailyGoalPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-green-500 rounded-full"
            />
          </div>
          <div className="flex justify-between mt-2">
             <span className="text-sm font-semibold text-white/70">{dailyStats.lessonsCompletedToday} / {dailyGoalTarget}</span>
             <span className="text-xs text-white/70 font-semibold">{dailyGoalPercent}%</span>
          </div>
        </div>

        {/* Global Total XP (Animated) */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-100 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:opacity-100 flex flex-col items-center justify-center cursor-pointer text-white scale-95 opacity-90">
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-xl font-black text-emerald-400 flex items-center gap-1">
             <motion.span>{rounded}</motion.span> <span className="text-white/70 font-semibold text-sm flex-1">Total XP</span>
          </div>
        </div>

        {/* XP Today */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-100 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:opacity-100 flex flex-col items-center justify-center cursor-pointer text-white scale-95 opacity-90">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-xl font-black text-yellow-400 flex items-center gap-1">
             <span className="text-white font-semibold">{dailyStats.xpEarnedToday}</span> <span className="text-white/70 font-semibold text-sm flex-1">XP Today</span>
          </div>
        </div>
        
        {/* Leaderboard Rank Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-100 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:opacity-100 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer text-white scale-95 opacity-90">
          <div className="text-3xl mb-1">🏆</div>
          <div className="text-xl font-black text-blue-400 mb-1 flex items-center gap-1">
            <span className="text-white/70 font-semibold text-sm">Your Rank:</span> <span className="text-white font-semibold">#{userRank}</span>
          </div>
          {lessonsToTop5 > 0 ? (
            <div className="text-xs font-semibold text-white/70 text-center">Only {lessonsToTop5} lessons to reach top 5</div>
          ) : (
             <div className="text-xs font-semibold text-emerald-400 text-center animate-pulse flex-1">You are in the Top 5!</div>
          )}
        </div>
        
        {/* Streak */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-100 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:opacity-100 flex flex-col items-center justify-center group cursor-pointer text-white relative scale-95 opacity-90">
          <div className="text-3xl mb-2 animate-bounce group-hover:animate-none">🔥</div>
          <div className="text-xl font-black text-orange-400 animate-pulse cursor-help relative flex items-center gap-1" title="Miss a day → streak resets">
             <span className="text-white font-semibold">{userStats.streak}</span> <span className="text-white/70 font-semibold text-sm flex-1">Day Streak</span>
          </div>
        </div>
      </motion.div>

      {/* 3. ACHIEVEMENTS & PRACTICE */}
      <motion.div variants={itemVariants}>
        <AchievementPanel achievements={achievements} />
        <PracticeCard />
      </motion.div>

      {/* 4. COURSE LIST */}
      <motion.div variants={itemVariants}>
        {enrolledCourses.length === 0 ? (
          <motion.div whileHover={{ scale: 1.02, rotateX: 5, rotateY: 5 }} className="text-center w-full py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-center justify-center space-y-6 shadow-xl transition-all duration-300 text-white">
            <h2 className="text-3xl font-extrabold tracking-tight">
              🚀 Start Your Coding Journey
            </h2>
            <p className="text-white/70 text-lg max-w-md mx-auto">
              Pick a course to begin learning.
            </p>
            <Link href="/courses">
              <Button size="lg" className="px-8 py-6 text-xl rounded-2xl border border-white/20 bg-emerald-500 hover:bg-emerald-400 text-white">
                Explore Courses &rarr;
              </Button>
            </Link>
          </motion.div>
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
      </div>
    </motion.div>
  );
}
