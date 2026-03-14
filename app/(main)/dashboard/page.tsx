import { CourseList } from "@/components/course/course-list";
import { getEnrolledCourses, getCourseProgressMap, getUserStats } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          What would you like to learn today?
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Select a path to continue your learning journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl shadow-sm border-2 border-border p-6 flex flex-col items-center justify-center">
          <div className="text-4xl mb-2">🔥</div>
          <div className="text-2xl font-black text-orange-500">{userStats.streak} Day Streak</div>
        </div>
        <div className="bg-card rounded-xl shadow-sm border-2 border-border p-6 flex flex-col items-center justify-center">
          <div className="text-4xl mb-2">⭐</div>
          <div className="text-2xl font-black text-primary">{userStats.totalXp} XP</div>
        </div>
        <div className="bg-card rounded-xl shadow-sm border-2 border-border p-6 flex flex-col items-center justify-center">
          <div className="text-4xl mb-2">📚</div>
          <div className="text-2xl font-black text-blue-500">{userStats.levelsCompleted} Levels Completed</div>
        </div>
      </div>

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
