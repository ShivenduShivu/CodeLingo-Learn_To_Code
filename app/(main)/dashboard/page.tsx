import { CourseList } from "@/components/course/course-list";
import { getEnrolledCourses, getCourseProgressMap, getUserStats, getDailyStats, getLatestAchievements } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AchievementPanel } from "@/components/gamification/achievement-panel";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const enrolledCourses = await getEnrolledCourses(user.id);
  const enrolledIds = enrolledCourses.map((c) => c.id);
  const courseProgressMap = await getCourseProgressMap(user.id);
  const userStats = await getUserStats(user.id);
  const dailyStats = await getDailyStats(user.id);
  const achievements = await getLatestAchievements(user.id, 3);
  
  const dailyGoalTarget = 5;
  const dailyGoalPercent = Math.min(Math.round((dailyStats.lessonsCompletedToday / dailyGoalTarget) * 100), 100);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          What would you like to learn today?
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Select a path to continue your learning journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Daily Goal Card */}
        <div className="md:col-span-2 bg-card rounded-xl shadow-sm border-2 border-border p-6 flex flex-col justify-center relative overflow-hidden group">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              🎯 Daily Goal
            </h3>
            <span className="text-sm font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {dailyStats.lessonsCompletedToday} / {dailyGoalTarget} Lessons
            </span>
          </div>
          <div className="h-4 w-full bg-muted rounded-full overflow-hidden relative border border-border">
            <div 
              className="h-full bg-green-500 transition-all duration-1000 ease-out"
              style={{ width: `${dailyGoalPercent}%` }}
            />
            {dailyGoalPercent === 100 && (
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            )}
          </div>
          <div className="text-right text-xs text-muted-foreground font-medium mt-2">
            {dailyGoalPercent}% Complete
          </div>
        </div>

        {/* Other Stat Cards */}
        <div className="bg-card rounded-xl shadow-sm border-2 border-border p-6 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-xl font-black text-yellow-500">{dailyStats.xpEarnedToday} XP Today</div>
        </div>
        
        <div className="bg-card rounded-xl shadow-sm border-2 border-border p-6 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-xl font-black text-orange-500">{userStats.streak} Day Streak</div>
        </div>
      </div>

      <AchievementPanel achievements={achievements} />

      {enrolledCourses.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center space-y-6">
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
    </div>
  );
}
