import { CourseList } from "@/components/course/course-list";

export const dynamic = 'force-dynamic';

export default function CoursesPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Course Catalog
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Explore all available gamified learning paths.
        </p>
      </div>

      <CourseList />
    </div>
  );
}
