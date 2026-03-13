import { getLeaderboard } from "@/lib/supabase/queries";
import { LeaderboardList } from "@/components/leaderboard/leaderboard-list";
import { createClient } from "@/lib/supabase/server";

// Revalidate this page every 60 seconds (ISR) as requested by the user
export const revalidate = 60;

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const limit = 50;
  const offset = (page - 1) * limit;

  // Fetch users ordered by total_xp natively in Supabase
  const players = await getLeaderboard(limit, offset);

  return (
    <div className="max-w-3xl mx-auto w-full px-4 md:px-6">
      <div className="flex flex-col items-center justify-center text-center space-y-4 my-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-lg">
          Compete with the entire community. Earn XP by completing lessons and skip tests to climb the ranks!
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 md:p-8">
        <LeaderboardList players={players} currentUserId={user?.id} />
      </div>
    </div>
  );
}
