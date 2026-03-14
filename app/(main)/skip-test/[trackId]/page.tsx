import { getLevels, getLessons, getQuestions, getAnswers, type Question, type Answer } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { QuizEngine } from "@/components/lesson/quiz-engine";
import { skipTrack } from "@/app/actions/skip-track";

export const dynamic = 'force-dynamic';

interface SkipTestPageProps {
  params: {
    trackId: string;
  };
}

export default async function SkipTestPage({ params }: SkipTestPageProps) {
  const supabase = createClient();
  const trackId = params.trackId;

  // Verify track exists
  const { data: trackMeta } = await supabase
    .from('tracks')
    .select('*')
    .eq('id', trackId)
    .single();

  if (!trackMeta) {
    notFound();
  }

  // 1. Fetch all levels for this track
  const levels = await getLevels(trackId);
  if (levels.length === 0) {
    notFound();
  }

  // 2. Gather all possible questions from this track
  const allQuestions: Question[] = [];
  for (const level of levels) {
    const lessons = await getLessons(level.id);
    for (const lesson of lessons) {
      const qs = await getQuestions(lesson.id);
      allQuestions.push(...qs);
    }
  }

  // Shuffle all questions and cap the test length at 10 to keep it manageable
  const shuffledAll = [...allQuestions].sort(() => 0.5 - Math.random());
  const examQuestions = shuffledAll.slice(0, 10);

  // If track has absolutely no questions seeded yet
  if (examQuestions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-center text-muted-foreground">
        <h2>No questions have been added to this track yet. Cannot skip!</h2>
      </div>
    );
  }

  // 3. Fetch answers for all selected exam questions
  const answersRecord: Record<string, Answer[]> = {};
  await Promise.all(
    examQuestions.map(async (q) => {
      const answers = await getAnswers(q.id);
      answersRecord[q.id] = answers;
    })
  );

  return (
    <QuizEngine 
      questions={examQuestions} 
      allAnswers={answersRecord}
      trackId={trackId}
      lessonTitle="Placement Test"
      onComplete={async (correctCount, total) => {
        "use server";
        return await skipTrack(trackId, correctCount, total);
      }}
    />
  );
}
