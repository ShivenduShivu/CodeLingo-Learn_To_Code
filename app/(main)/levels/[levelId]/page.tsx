import { getLessons } from "@/lib/supabase/queries";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export const dynamic = 'force-dynamic';

interface LevelLauncherProps {
  params: {
    levelId: string;
  };
}

export default async function LevelLauncherPage({ params }: LevelLauncherProps) {
  const lessons = await getLessons(params.levelId);

  if (!lessons || lessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">Lesson Preparation</h1>
        <div className="p-8 mt-8 border border-white/20 rounded-3xl max-w-md w-full bg-white/5 backdrop-blur-xl text-white">
          <p className="font-medium text-white/80">
            No lessons have been generated for this level yet.
          </p>
          <p className="text-sm text-white/50 mt-4">
            If you are viewing the Python Level 1, make sure you ran the `seed_lessons.sql` script!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12 space-y-8 min-h-[80vh] flex flex-col justify-center">
      <div className="bg-gradient-to-r from-yellow-400/90 to-orange-500/90 backdrop-blur-md shadow-lg py-6 px-8 rounded-2xl mb-12 border border-white/20">
        <h1 className="text-3xl font-bold text-white">Level Progression</h1>
        <p className="text-white/80 text-sm mt-1">Complete the modules below to master this concept.</p>
        <div className="mt-4 w-full bg-white/20 rounded-full h-2 overflow-hidden shadow-inner">
          <div className="bg-green-400 h-2 rounded-full transition-all duration-500" style={{ width: "60%" }} />
        </div>
      </div>

      <div className="w-full">
        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-white/20" />
          <div className="flex flex-col gap-6">
            {lessons.map((lesson, idx) => {
              let status = "locked";
              if (idx === 0) status = "completed";
              else if (idx === 1) status = "current";
              
              let cardStyle = "bg-white/5 border border-white/10 opacity-50 cursor-not-allowed";
              let dotStyle = "bg-gray-500";

              if (status === "completed") {
                cardStyle = "bg-white/10 border border-green-400/30 opacity-80 hover:scale-[1.02] hover:shadow-lg cursor-pointer";
                dotStyle = "bg-green-400";
              } else if (status === "current") {
                cardStyle = "bg-white/20 border-2 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)] scale-[1.02] animate-pulse cursor-pointer hover:shadow-xl";
                dotStyle = "bg-yellow-400 animate-pulse ring-4 ring-yellow-400/30";
              }

              return (
                <div key={lesson.id} className="relative flex items-center group">
                  {/* Left dot */}
                  <div className={`absolute -left-[1.35rem] w-4 h-4 rounded-full z-10 ${dotStyle}`} />
                  
                  {/* Card */}
                  <div className={`w-full rounded-xl p-5 transition-all duration-200 flex justify-between items-center text-white ${cardStyle}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${status === 'completed' ? 'bg-green-400/20 text-green-300' : status === 'current' ? 'bg-green-500/20 text-green-400 ring-2 ring-green-400/50' : 'bg-white/10 text-white/50'}`}>
                         {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{lesson.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-3 py-1 rounded-full bg-green-400/20 text-green-300 font-semibold uppercase tracking-wider">
                            {lesson.lesson_type} MODULE
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {status !== "locked" && (
                      <Link 
                        href={`/lessons/${lesson.id}`}
                        className={`px-6 py-2 ${status === 'completed' ? 'bg-white/20 hover:bg-white/30 text-white/90' : 'bg-emerald-500 hover:bg-emerald-400 border border-emerald-400/50 text-white'} font-bold rounded-xl transition-all text-center flex-shrink-0 shadow-sm`}
                      >
                        {status === "completed" ? "Review" : "Start"}
                      </Link>
                    )}
                    {status === "locked" && (
                      <div className="px-6 py-2 bg-white/5 text-white/30 font-bold rounded-xl border border-white/10 text-center flex-shrink-0 cursor-not-allowed">
                        Locked
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
