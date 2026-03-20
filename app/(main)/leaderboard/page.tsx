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
      <div className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-xl py-6 px-6 text-white shadow-xl flex flex-col items-center text-center space-y-2 mb-4 relative overflow-hidden max-w-2xl mx-auto">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm relative z-10">
           <Crown className="w-8 h-8 text-yellow-300 drop-shadow-md" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight drop-shadow-md relative z-10">Global Leaderboard</h1>
        <p className="text-sm text-white/70 relative z-10">Compete with the world. Top ranking.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-end gap-6 mt-8 mb-12">
         {/* SECOND PLACE */}
         {leaderboard[1] && (
           <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 w-48 text-center border border-white/10 shadow-lg order-2 md:order-1 flex flex-col items-center scale-95 opacity-90 space-y-2">
             <div className="text-4xl drop-shadow-md">🥈</div>
             <img className="w-20 h-20 rounded-full mx-auto border-4 border-slate-300 ring-2 ring-white/30 object-cover" src={leaderboard[1].avatar_url || "https://api.dicebear.com/7.x/bottts/svg?seed=fallback"} />
             <p className="text-white text-lg font-semibold truncate w-full">{leaderboard[1].username}</p>
             <p className="text-yellow-300 font-extrabold text-2xl">{leaderboard[1].xp} XP</p>
           </div>
         )}
         
         {/* FIRST PLACE */}
         {leaderboard[0] && (
           <div className="bg-yellow-400/20 backdrop-blur-md border-2 border-yellow-300 rounded-2xl p-6 w-56 text-center shadow-[0_0_25px_rgba(255,215,0,0.4)] scale-110 z-10 order-1 md:order-2 flex flex-col items-center animate-pulse space-y-2">
             <div className="text-5xl drop-shadow-lg">👑</div>
             <img className="w-24 h-24 rounded-full mx-auto border-4 border-yellow-400 ring-2 ring-white/30 object-cover" src={leaderboard[0].avatar_url || "https://api.dicebear.com/7.x/bottts/svg?seed=fallback"} />
             <p className="text-white text-xl font-bold truncate w-full">{leaderboard[0].username}</p>
             <p className="text-yellow-300 font-extrabold text-2xl drop-shadow-[0_0_10px_rgba(253,224,71,0.5)]">{leaderboard[0].xp} XP</p>
           </div>
         )}
         
         {/* THIRD PLACE */}
         {leaderboard[2] && (
           <div className="bg-orange-500/20 backdrop-blur-md border border-orange-500/50 rounded-2xl p-5 w-48 text-center shadow-lg order-3 flex flex-col items-center scale-95 opacity-90 space-y-2">
             <div className="text-4xl drop-shadow-md">🥉</div>
             <img className="w-20 h-20 rounded-full mx-auto border-4 border-orange-400 ring-2 ring-white/30 object-cover" src={leaderboard[2].avatar_url || "https://api.dicebear.com/7.x/bottts/svg?seed=fallback"} />
             <p className="text-white text-lg font-semibold truncate w-full">{leaderboard[2].username}</p>
             <p className="text-yellow-300 font-extrabold text-2xl">{leaderboard[2].xp} XP</p>
           </div>
         )}
      </div>

      <div className="mt-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl">
         <table className="w-full text-left">
           <thead className="bg-white/5 border-b border-white/10">
             <tr>
               <th className="px-6 py-4 font-bold text-white/60">Rank</th>
               <th className="px-6 py-4 font-bold text-white/60">User</th>
               <th className="px-6 py-4 font-bold text-right text-white/60 hidden sm:table-cell">Change</th>
               <th className="px-6 py-4 font-bold text-right text-white/60">Streak</th>
               <th className="px-6 py-4 font-bold text-right text-white/60">XP</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-white/5">
             {leaderboard.map((u, i) => {
               const rank = i + 1;
               if (rank <= 3) return null;
               
               const isCurrentUser = u.id === userId;
               const mockChange = rank % 2 === 0 ? 2 : -1;
               
               return (
                 <tr 
                   key={u.id} 
                   className={cn(
                     "hover:bg-white/10 hover:scale-[1.01] transition-all duration-200 cursor-pointer",
                     isCurrentUser && "bg-green-500/10 border-l-4 border-green-400"
                   )}
                 >
                   <td className="px-6 py-4 font-bold">
                     <span className="text-white/80">#{rank}</span>
                   </td>
                   <td className="px-6 py-4 font-semibold text-white flex items-center gap-3">
                     <img 
                        src={u.avatar_url || "https://api.dicebear.com/7.x/bottts/svg?seed=fallback"} 
                        alt={u.username} 
                        className="w-8 h-8 rounded-full border border-white/20 bg-white/10 object-cover shrink-0"
                     />
                     <span className="truncate max-w-[120px] sm:max-w-none">{u.username}</span>
                     {isCurrentUser && (
                       <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold ml-2">
                         YOU
                       </span>
                     )}
                   </td>
                   <td className="px-6 py-4 text-right transform transition-all hidden sm:table-cell">
                      {mockChange > 0 ? (
                        <span className="text-emerald-400 font-bold flex items-center justify-end gap-1">
                          <ArrowUp className="w-4 h-4" /> {mockChange}
                        </span>
                      ) : (
                        <span className="text-red-400 font-bold flex items-center justify-end gap-1">
                          <ArrowDown className="w-4 h-4" /> {Math.abs(mockChange)}
                        </span>
                      )}
                   </td>
                   <td className="px-6 py-4 text-right">
                     <div className="group relative inline-flex items-center gap-1 font-bold text-orange-400 cursor-help">
                        {u.streak} <Flame className="w-4 h-4 text-orange-500 drop-shadow-md" />
                     </div>
                   </td>
                   <td className="px-6 py-4 text-right">
                     <span className="text-yellow-300 font-semibold text-xl">{u.xp}</span>
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
