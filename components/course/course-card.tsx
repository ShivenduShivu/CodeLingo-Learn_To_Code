"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { type Course } from "@/lib/supabase/queries";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.slug}`}>
      <motion.div
        whileHover={{
          scale: 1.05,
          y: -5,
          transition: { type: "spring", stiffness: 300 },
        }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-b-8 border-border bg-card p-6 cursor-pointer transition-shadow"
        style={{
          boxShadow: `0 0 0 0 ${course.color_hex}00`, // Transparent 00 hex code suffix
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0px 10px 40px -10px ${course.color_hex}80`;
          e.currentTarget.style.borderColor = `${course.color_hex}60`;
          e.currentTarget.style.borderBottomColor = course.color_hex;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "";
          e.currentTarget.style.borderColor = "";
          e.currentTarget.style.borderBottomColor = "";
        }}
      >
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

        <div>
          <h3 className="text-2xl font-bold tracking-tight mb-2 text-foreground">
            {course.title}
          </h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {course.description}
          </p>
        </div>

        {/* Decorative inner glow circle on hover */}
        <div 
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity blur-2xl pointer-events-none"
          style={{ backgroundColor: course.color_hex }}
        />
      </motion.div>
    </Link>
  );
}
