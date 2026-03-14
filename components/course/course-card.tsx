"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { type Course, type CourseProgressSummary } from "@/lib/supabase/queries";
import { EnrollButton } from "./enroll-button";

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
        <h3 className="text-2xl font-bold tracking-tight mb-2 text-foreground">
          {course.title}
        </h3>
        <p className="text-muted-foreground line-clamp-2 text-sm flex-1">
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
                
                <div className="grid grid-cols-2 gap-y-1 text-xs font-medium text-muted-foreground">
                  <div>
                    <span className="text-foreground font-bold">{progressSummary.completedLevels} / {progressSummary.totalLevels}</span> Levels
                  </div>
                  <div className="text-right text-xp font-bold">
                    {progressSummary.xpEarned} XP Earned
                  </div>
                  <div className="col-span-2 truncate mt-1">
                    Track: <span className="text-foreground font-bold">{progressSummary.track_title}</span>
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

  const wrapperProps = {
    whileHover: { scale: 1.05, y: -5, transition: { type: "spring" as const, stiffness: 300 } },
    whileTap: { scale: 0.95 },
    className: "group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-b-8 border-border bg-card p-6 cursor-pointer transition-shadow h-full",
    style: { boxShadow: `0 0 0 0 ${course.color_hex}00` }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = `0px 10px 40px -10px ${course.color_hex}80`;
    e.currentTarget.style.borderColor = `${course.color_hex}60`;
    e.currentTarget.style.borderBottomColor = course.color_hex;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = "";
    e.currentTarget.style.borderColor = "";
    e.currentTarget.style.borderBottomColor = "";
  };

  if (isEnrolled) {
     return (
       <Link className="h-full block" href={`/courses/${course.slug}`}>
         <motion.div 
            {...wrapperProps} 
            className={wrapperProps.className + " hover:-translate-y-1"}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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
       onMouseEnter={handleMouseEnter}
       onMouseLeave={handleMouseLeave}
    >
       {CardContent}
    </motion.div>
  );
}
