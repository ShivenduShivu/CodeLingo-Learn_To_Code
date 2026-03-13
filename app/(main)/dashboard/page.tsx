import { CourseList } from "@/components/course/course-list";

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          What would you like to learn today?
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Select a path to continue your learning journey.
        </p>
      </div>

      <CourseList />
    </div>
  );
}
