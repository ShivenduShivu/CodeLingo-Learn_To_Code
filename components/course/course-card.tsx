"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { type Course, type CourseProgressSummary } from "@/lib/supabase/queries";
import { EnrollButton } from "./enroll-button";
import { playClickSound } from "@/lib/utils/sound";

interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
  progressSummary?: CourseProgressSummary;
}

export function CourseCard({ course, isEnrolled, progressSummary }: CourseCardProps) {
  const progressPercent = progressSummary?.progressPercent || 0;

  const CardContent = (
    <>
      <div className="flex justify-between items-start mb-4">
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center p-3"
          style={{ backgroundColor: `${course.color_hex}20` }}
        >
          {/* Fallback box if svg isn't present, but colored with theme */}
          <div 
            className="w-full h-full rounded shadow-inner" 
            style={{ backgroundColor: course.color_hex }}
          />
        </div>
      </div>

      <div className="flex flex-col flex-1 h-full">
        <h3 className="text-2xl font-bold tracking-tight mb-2 text-white">
          {course.title}
        </h3>
        <p className="text-white/70 line-clamp-2 text-sm flex-1">
          {course.description}
        </p>
        
        {!isEnrolled ? (
          <div className="mt-auto pointer-events-auto">
             <EnrollButton courseId={course.id} />
          </div>
        ) : (
          <div className="mt-auto space-y-4">
            {progressSummary && (
              <div className="space-y-3">
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${progressPercent}%`, backgroundColor: course.color_hex }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-y-1 text-xs font-medium text-white/70">
                  <div>
                    <span className="text-white/90 font-medium">{progressSummary.completedLevels} / {progressSummary.totalLevels}</span> Levels
                  </div>
                  <div className="text-right text-emerald-400 font-bold">
                    {progressSummary.xpEarned} XP Earned
                  </div>
                  <div className="col-span-2 truncate mt-1">
                    Track: <span className="text-white/90 font-medium">{progressSummary.track_title}</span>
                  </div>
                </div>
              </div>
            )}
            <span className="inline-flex items-center text-primary font-bold">
              Continue Learning &rarr;
            </span>
          </div>
        )}
      </div>

      {/* Decorative inner glow circle on hover */}
      <div 
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity blur-2xl pointer-events-none"
        style={{ backgroundColor: course.color_hex }}
      />
    </>
  );

  let baseCardClass = "bg-white/10 backdrop-blur-lg border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]";
  
  if (course.slug === "python-basics" || course.title.toLowerCase().includes("python") || course.slug.includes("machine-learning") || course.title.toLowerCase().includes("machine learning")) {
    baseCardClass = "bg-white/10 backdrop-blur-lg border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:scale-105 transition-all";
  }

  const wrapperProps = {
    whileTap: { scale: 0.98 },
    className: `group relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 transition-all duration-300 cursor-pointer h-full text-white ${baseCardClass}`,
    style: { }
  };

  if (isEnrolled) {
     return (
       <Link className="h-full block" href={`/courses/${course.slug}`}>
         <motion.div 
            {...wrapperProps} 
            className={wrapperProps.className}
            onClick={() => playClickSound()}
         >
            {CardContent}
         </motion.div>
       </Link>
     );
  }

  // Not enrolled: acts purely as a UI card with an actionable enroll button inside
  return (
    <motion.div 
       {...wrapperProps}
       onClick={() => playClickSound()}
    >
       {CardContent}
    </motion.div>
  );
}
