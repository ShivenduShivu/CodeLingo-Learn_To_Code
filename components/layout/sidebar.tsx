"use client";

import { BookOpen, Trophy, User, Home, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // Helper macro for styling
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-green-900/90 to-black/90 backdrop-blur-xl border-r border-white/10 shadow-[0_0_30px_rgba(0,255,100,0.1)] hidden md:flex flex-col fixed left-0 top-0 pt-6 px-4 z-50 text-white">
      <div className="absolute right-0 top-0 h-full w-[1px] bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.5)] pointer-events-none" />
      <div className="font-extrabold text-3xl text-emerald-400 tracking-tight mb-12 pl-4">CodeLingo</div>
      <nav className="flex flex-col gap-2 flex-1">
        <Link href="/dashboard" className={`flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/10 text-white/60 hover:text-white font-bold transition-all duration-300 ease-out ${pathname === "/dashboard" ? "bg-green-500/20 text-green-300" : ""}`}><Home className="w-6 h-6" /> Learn</Link>
        <Link href="/courses" className={`flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/10 text-white/60 hover:text-white font-bold transition-all duration-300 ease-out ${isActive("/courses") || isActive("/tracks") ? "bg-green-500/20 text-green-300" : ""}`}><BookOpen className="w-6 h-6" /> Courses</Link>
        <Link href="/leaderboard" className={`flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/10 text-white/60 hover:text-white font-bold transition-all duration-300 ease-out ${isActive("/leaderboard") ? "bg-green-500/20 text-green-300" : ""}`}><Trophy className="w-6 h-6" /> Leaderboard</Link>
        <Link href="/profile" className={`flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/10 text-white/60 hover:text-white font-bold transition-all duration-300 ease-out ${isActive("/profile") ? "bg-green-500/20 text-green-300" : ""}`}><User className="w-6 h-6" /> Profile</Link>
      </nav>

      <div className="mt-auto pb-8 pl-4 pr-4">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-500/20 text-white/60 hover:text-red-400 font-bold transition-all"
        >
          <LogOut className="w-6 h-6" /> Logout
        </button>
      </div>
    </aside>
  );
};
