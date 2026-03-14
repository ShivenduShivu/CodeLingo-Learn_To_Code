
import { getEnrolledCourses, getCourseProgressMap, getUserStats, getDailyStats, getLatestAchievements } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

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
  
  return (
    <DashboardContent 
       enrolledCourses={enrolledCourses}
       enrolledIds={enrolledIds}
       courseProgressMap={courseProgressMap}
       userStats={userStats}
       dailyStats={dailyStats}
       achievements={achievements}
    />
  );
}
