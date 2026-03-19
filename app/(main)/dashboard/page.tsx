
import { getEnrolledCourses, getCourseProgressMap, getUserStats, getDailyStats, getLatestAchievements, getLeaderboard } from "@/lib/supabase/queries";
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
  const leaderboard = await getLeaderboard(50);
  
  const userRankIndex = leaderboard.findIndex(u => u.id === user.id);
  const userRank = userRankIndex >= 0 ? userRankIndex + 1 : leaderboard.length + 1;
  
  let targetXp = 0;
  if (leaderboard.length >= 5) {
     targetXp = leaderboard[4].xp;
  }
  const xpDiff = Math.max(0, targetXp - userStats.totalXp);
  const lessonsToTop5 = xpDiff > 0 ? Math.ceil(xpDiff / 15) : 0;
  
  return (
    <DashboardContent 
       enrolledCourses={enrolledCourses}
       enrolledIds={enrolledIds}
       courseProgressMap={courseProgressMap}
       userStats={userStats}
       dailyStats={dailyStats}
       achievements={achievements}
       userRank={userRank}
       lessonsToTop5={lessonsToTop5}
    />
  );
}
