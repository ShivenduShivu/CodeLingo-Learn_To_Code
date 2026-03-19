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
    <aside className="w-64 h-screen border-r border-border hidden md:flex flex-col bg-card fixed left-0 top-0 pt-6 px-4 z-50">
      <div className="font-extrabold text-3xl text-primary tracking-tight mb-12 pl-4">CodeLingo</div>
      <nav className="flex flex-col gap-2 flex-1">
        <Link href="/dashboard" className={`flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground font-bold transition-all ${pathname === "/dashboard" ? "bg-primary/10 text-primary hover:text-primary hover:bg-primary/15" : ""}`}><Home className="w-6 h-6" /> Learn</Link>
        <Link href="/courses" className={`flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground font-bold transition-all ${isActive("/courses") || isActive("/tracks") ? "bg-primary/10 text-primary hover:text-primary hover:bg-primary/15" : ""}`}><BookOpen className="w-6 h-6" /> Courses</Link>
        <Link href="/leaderboard" className={`flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground font-bold transition-all ${isActive("/leaderboard") ? "bg-primary/10 text-primary hover:text-primary hover:bg-primary/15" : ""}`}><Trophy className="w-6 h-6" /> Leaderboard</Link>
        <Link href="/profile" className={`flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground font-bold transition-all ${isActive("/profile") ? "bg-primary/10 text-primary hover:text-primary hover:bg-primary/15" : ""}`}><User className="w-6 h-6" /> Profile</Link>
      </nav>

      <div className="mt-auto pb-8 pl-4 pr-4">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-50 text-muted-foreground hover:text-red-500 font-bold transition-all"
        >
          <LogOut className="w-6 h-6" /> Logout
        </button>
      </div>
    </aside>
  );
};
