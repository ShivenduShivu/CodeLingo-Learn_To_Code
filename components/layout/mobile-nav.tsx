"use client";

import { Home, BookOpen, Trophy, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const MobileNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0f172a]/80 backdrop-blur-xl border-t border-white/10 flex justify-around items-center md:hidden z-50 pb-safe text-white">
      <Link href="/dashboard" className="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform text-slate-400 hover:text-slate-500">
        <Home className={`w-6 h-6 ${pathname === "/dashboard" ? "text-primary fill-primary/20" : ""}`} />
      </Link>
      <Link href="/courses" className="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform text-slate-400 hover:text-slate-500">
        <BookOpen className={`w-6 h-6 ${(pathname.includes("/courses") || pathname.includes("/tracks")) ? "text-primary fill-primary/20" : ""}`} />
      </Link>
      <Link href="/leaderboard" className="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform text-slate-400 hover:text-slate-500">
        <Trophy className={`w-6 h-6 ${pathname === "/leaderboard" ? "text-primary fill-primary/20" : ""}`} />
      </Link>
      <Link href="/profile" className="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform text-slate-400 hover:text-slate-500 pb-1">
        <User className={`w-6 h-6 ${pathname === "/profile" ? "text-primary fill-primary/20" : ""}`} />
      </Link>
    </nav>
  );
};
