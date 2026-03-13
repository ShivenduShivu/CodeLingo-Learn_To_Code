import { getLessons } from "@/lib/supabase/queries";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const dynamic = 'force-dynamic';

interface LevelLauncherProps {
  params: {
    levelId: string;
  };
}

export default async function LevelLauncherPage({ params }: LevelLauncherProps) {
  const lessons = await getLessons(params.levelId);

  if (!lessons || lessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Lesson Preparation</h1>
        <div className="p-8 mt-8 border-2 border-dashed border-border rounded-2xl max-w-md w-full bg-card/50">
          <p className="font-medium text-muted-foreground">
            No lessons have been generated for this level yet.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            If you are viewing the Python Level 1, make sure you ran the `seed_lessons.sql` script!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12 space-y-8 min-h-[80vh] flex flex-col justify-center">
      <div className="text-center space-y-4 mb-12">
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-primary mb-6 ring-8 ring-primary/10">
          <BookOpen className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">Level Syllabus</h1>
        <p className="text-muted-foreground text-lg">Complete the modules below to master this concept.</p>
      </div>

      <div className="space-y-4 w-full">
        {lessons.map((lesson, idx) => (
          <div key={lesson.id} className="p-6 bg-card border-2 border-border border-b-4 rounded-xl flex justify-between items-center transition-transform hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-muted-foreground/10 text-muted-foreground rounded-full flex items-center justify-center font-bold">
                 {idx + 1}
              </div>
              <div>
                <h3 className="text-lg font-bold">{lesson.title}</h3>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Type: {lesson.lesson_type}
                </span>
              </div>
            </div>
            
            <Link 
              href={`/lessons/${lesson.id}`}
              className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-xl border-b-4 border-primary-foreground/20 hover:bg-primary/90 active:translate-y-1 active:border-b-0 transition-all text-center flex-shrink-0"
            >
              Start Module
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
