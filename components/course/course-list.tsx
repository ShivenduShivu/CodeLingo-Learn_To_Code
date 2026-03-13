import { CourseCard } from "./course-card";
import { getCourses } from "@/lib/supabase/queries";

export async function CourseList() {
  const courses = await getCourses();

  if (!courses || courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border rounded-xl">
        <h3 className="text-xl font-bold mb-2">No Courses Found</h3>
        <p className="text-muted-foreground">
          Run your database seed to populate content.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
