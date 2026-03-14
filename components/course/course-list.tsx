import { CourseCard } from "./course-card";
import { type Course, type CourseProgressSummary } from "@/lib/supabase/queries";

export interface CourseListProps {
  courses: Course[];
  enrolledIds: string[];
  courseProgressMap?: Record<string, CourseProgressSummary>;
  emptyMessage?: string;
  emptySubMessage?: string;
}

export function CourseList({ courses, enrolledIds, courseProgressMap = {}, emptyMessage = "No Courses Found", emptySubMessage = "Run your database seed to populate content." }: CourseListProps) {
  if (!courses || courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border rounded-xl">
        <h3 className="text-xl font-bold mb-2">{emptyMessage}</h3>
        <p className="text-muted-foreground">{emptySubMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard 
           key={course.id} 
           course={course} 
           isEnrolled={enrolledIds.includes(course.id)} 
           progressSummary={courseProgressMap[course.id]}
        />
      ))}
    </div>
  );
}
