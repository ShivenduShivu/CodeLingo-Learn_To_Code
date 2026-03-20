import { getCourseBySlug, getTracks } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";

interface CoursePageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await getCourseBySlug(params.slug);

  if (!course) {
    notFound();
  }

  const tracks = await getTracks(course.id);

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-8">
      <div className="bg-gradient-to-r from-yellow-400/80 to-orange-500/80 backdrop-blur-md shadow-xl p-8 rounded-2xl border border-white/20 text-white">
        <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-md">
          {course.title}
        </h1>
        <p className="text-white/90 text-lg mt-2 font-medium">
          {course.description}
        </p>
        <p className="text-white/80 text-sm mt-2 font-bold tracking-wide">
          Progress: 40% • 120 XP earned
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-white">Learning Tracks</h2>
        
        {tracks.length === 0 ? (
          <p className="text-white/70">No tracks generated for this course yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {tracks.map((track, idx) => {
              const isCurrent = idx === 0;
              const isLocked = idx > 0;
              
              let cardClasses = "p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-6 text-white hover:scale-[1.02] hover:shadow-xl transition-all duration-200";
              
              if (isCurrent) cardClasses += " border-2 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)] scale-[1.02]";
              if (isLocked) cardClasses += " opacity-50 cursor-not-allowed";

              return (
                <GlassCard key={track.id} className={cardClasses}>
                  <div className="w-full md:w-2/3">
                    <h3 className="text-xl font-bold">{track.title}</h3>
                    <span className="text-sm font-bold text-white/50 uppercase tracking-wider">
                      {track.difficulty_level}
                    </span>
                    
                    {/* Progress Bar */}
                    <div className="mt-3 w-full bg-white/10 rounded-full h-1.5">
                      <div className="bg-green-400 h-1.5 rounded-full" style={{ width: isCurrent ? "40%" : "0%" }} />
                    </div>
                    <p className="text-xs font-bold text-white/60 mt-2">
                       {isCurrent ? "2 / 5" : "0 / 5"} lessons completed
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0 flex items-center justify-end">
                    {isLocked ? (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-white/50 uppercase tracking-wider">🔒 Locked</span>
                        <div className="px-6 py-3 bg-white/5 text-white/30 font-bold rounded-xl border border-white/10 cursor-not-allowed text-center">
                          Locked
                        </div>
                      </div>
                    ) : (
                      <Link 
                        href={`/tracks/${track.id}`}
                        className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl border border-emerald-400/50 hover:scale-105 transition-all duration-200 shadow-lg text-center"
                      >
                        {isCurrent ? "Continue →" : "Start Learning →"}
                      </Link>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
