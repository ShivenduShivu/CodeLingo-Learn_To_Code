import { CourseList } from "@/components/course/course-list";
import { getCourses, getEnrolledCourseIds, getCourseProgressMap } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const allCourses = await getCourses();
  const enrolledIds = await getEnrolledCourseIds(user.id);
  const courseProgressMap = await getCourseProgressMap(user.id);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Course Catalog
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Explore all available gamified learning paths.
        </p>
      </div>

      <CourseList 
         courses={allCourses} 
         enrolledIds={enrolledIds}
         courseProgressMap={courseProgressMap}
         emptyMessage="No available courses."
      />
    </div>
  );
}
