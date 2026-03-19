import { getLeaderboard } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { Crown, Flame, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function LeaderboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  const leaderboard = await getLeaderboard(20);

  if (leaderboard.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
         <Crown className="w-24 h-24 text-yellow-400 opacity-50" />
         <h1 className="text-2xl font-bold text-muted-foreground">Be the first to climb the leaderboard 🚀</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-yellow-100 p-4 rounded-full">
           <Crown className="w-12 h-12 text-yellow-500" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">Global Leaderboard</h1>
        <p className="text-lg text-muted-foreground">Compete with the world. Top 20 ranking.</p>
      </div>

      <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-sm">
         <table className="w-full text-left">
           <thead className="bg-muted">
             <tr>
               <th className="px-6 py-4 font-bold text-muted-foreground">Rank</th>
               <th className="px-6 py-4 font-bold text-muted-foreground">User</th>
               <th className="px-6 py-4 font-bold text-right text-muted-foreground">Change</th>
               <th className="px-6 py-4 font-bold text-right text-muted-foreground">Streak</th>
               <th className="px-6 py-4 font-bold text-right text-muted-foreground">XP</th>
             </tr>
           </thead>
           <tbody>
             {leaderboard.map((u, i) => {
               const rank = i + 1;
               const isCurrentUser = u.id === userId;
               // Mock simulation requirement
               const mockChange = rank % 2 === 0 ? 2 : -1;
               
               return (
                 <tr 
                   key={u.id} 
                   className={cn(
                     "border-t border-border/50 hover:bg-muted/50 transition-colors",
                     isCurrentUser && "bg-emerald-100/50 hover:bg-emerald-100/80 border-emerald-400 border-x-4 border-l-emerald-500"
                   )}
                 >
                   <td className="px-6 py-4 font-bold">
                     <div className="flex items-center gap-2">
                       {rank === 1 && <Crown className="w-5 h-5 text-yellow-500 fill-current" />}
                       {rank === 2 && <Crown className="w-5 h-5 text-gray-400 fill-current" />}
                       {rank === 3 && <Crown className="w-5 h-5 text-amber-600 fill-current" />}
                       <span className={cn(rank <= 3 && "text-lg")}>#{rank}</span>
                     </div>
                   </td>
                   <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-3">
                     {u.username}
                     {isCurrentUser && (
                       <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                         YOU
                       </span>
                     )}
                   </td>
                   <td className="px-6 py-4 text-right transform transition-all">
                      {mockChange > 0 ? (
                        <span className="text-green-500 font-bold flex items-center justify-end gap-1">
                          <ArrowUp className="w-4 h-4" /> {mockChange}
                        </span>
                      ) : (
                        <span className="text-red-500 font-bold flex items-center justify-end gap-1">
                          <ArrowDown className="w-4 h-4" /> {Math.abs(mockChange)}
                        </span>
                      )}
                   </td>
                   <td className="px-6 py-4 text-right">
                     <div className="group relative inline-flex items-center gap-1 font-bold animate-pulse text-orange-500 cursor-help">
                        {u.streak} <Flame className="w-4 h-4" />
                        
                        <div className="absolute bottom-full right-0 mb-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all bg-foreground text-background text-xs font-bold rounded px-3 py-2 whitespace-nowrap z-50">
                           Miss a day → streak resets
                        </div>
                     </div>
                   </td>
                   <td className="px-6 py-4 text-right font-black text-xl text-yellow-500">
                     {u.xp}
                   </td>
                 </tr>
               );
             })}
           </tbody>
         </table>
      </div>
    </div>
  );
}
