import { getQuestions, getAnswers, type Answer } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { QuizEngine } from "@/components/lesson/quiz-engine";
import { completeLevel } from "@/app/actions/progress";

export const dynamic = 'force-dynamic';

interface LessonPageProps {
  params: {
    lessonId: string;
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  // We need to resolve the trackId to safely return the user to the map on exit
  const supabase = createClient();
  const { data: lessonMeta } = await supabase
    .from('lessons')
    .select('*, levels(track_id)')
    .eq('id', params.lessonId)
    .single();

  if (!lessonMeta) {
    notFound();
  }

  const trackId = lessonMeta.levels?.track_id || "";

  // 1. Fetch questions directly associated with this lesson
  const questions = await getQuestions(params.lessonId);
  
  // 2. We need answers for all questions
  // Since we don't have a bulk getAnswers by lesson, we do an Array mapping 
  // (In a prod system with large payloads, you would write a custom SQL query for bulk retrieval to avoid N+1)
  const answersRecord: Record<string, Answer[]> = {};
  
  await Promise.all(
    questions.map(async (q) => {
      const answers = await getAnswers(q.id);
      answersRecord[q.id] = answers;
    })
  );

  return (
    <QuizEngine 
      questions={questions} 
      allAnswers={answersRecord}
      trackId={trackId}
      onComplete={async (correctCount, total) => {
        "use server";
        return await completeLevel(lessonMeta.level_id, correctCount, total);
      }}
    />
  );
}
