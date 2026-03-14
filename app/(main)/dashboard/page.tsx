import { CourseList } from "@/components/course/course-list";
import { getEnrolledCourses } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const enrolledCourses = await getEnrolledCourses(user.id);
  const enrolledIds = enrolledCourses.map((c) => c.id);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          What would you like to learn today?
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Select a path to continue your learning journey.
        </p>
      </div>

      <CourseList 
         courses={enrolledCourses} 
         enrolledIds={enrolledIds} 
         emptyMessage="You haven't enrolled in any courses yet!"
         emptySubMessage="Start your learning journey by enrolling in a course."
      />
    </div>
  );
}
