"use client";

import { useEffect, useState } from "react";
import { type Question, type Answer } from "@/lib/supabase/queries";
import { useLessonStore } from "@/lib/store/useLessonStore";
import { ProgressBar } from "@/components/lesson/progress-bar";
import { MultipleChoice } from "@/components/lesson/question-types/multiple-choice";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { UnlockEvent } from "@/lib/achievements/evaluator";
import { AIMentor } from "@/components/lesson/ai-mentor";
import { LessonComplete } from "@/components/lesson/lesson-complete";

interface QuizEngineProps {
  questions: Question[];
  allAnswers: Record<string, Answer[]>;
  trackId: string;
  onComplete: (correctCount: number, totalQuestions: number) => Promise<{ success: boolean; earnedXp?: number; stars?: number; newStreak?: number; newAchievements?: UnlockEvent[]; error?: string }>;
}

export function QuizEngine({ questions, allAnswers, trackId, onComplete }: QuizEngineProps) {
  const router = useRouter();
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [earnedData, setEarnedData] = useState<{ xp: number, stars: number, streak: number, achievements?: UnlockEvent[] } | null>(null);
  
  const { 
    currentQuestionIndex, 
    selectedAnswer, 
    isChecking, 
    isCorrect,
    correctAnswers,
    checkAnswer,
    nextQuestion,
    decrementHeart,
    resetLesson 
  } = useLessonStore();

  useEffect(() => {
    resetLesson();
  }, [resetLesson]);

  if (questions.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">No questions found for this lesson yet.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answersForCurrentQ = allAnswers[currentQuestion.id] || [];

  const handleActionClick = async () => {
    if (isChecking) {
      // Currently displaying results -> Move to next or Finish
      if (currentQuestionIndex < questions.length - 1) {
        nextQuestion(questions.length);
      } else {
        // Finish the quiz! Trigger injected Server Action
        setIsFinished(true);
        setIsSaving(true);
        try {
          const res = await onComplete(correctAnswers, questions.length);
          if (res.success) {
            const successData = res as { success: true; earnedXp: number; stars: number; newStreak: number; newAchievements?: UnlockEvent[] };
            setEarnedData({ xp: successData.earnedXp, stars: successData.stars, streak: successData.newStreak, achievements: successData.newAchievements });
          } else {
            const errorData = res as { success: false; error: string };
            console.error(errorData.error);
            setEarnedData(null);
            setTimeout(() => {
               alert("Notice: " + (errorData.error || "Failed to save progress. Are you logged in?"));
               router.push(`/tracks/${trackId}`);
            }, 1000);
          }
        } catch (e: unknown) {
          const err = e as Error;
          console.error("Progress save error:", err);
          setTimeout(() => {
             alert("Error saving progress: " + err.message);
             router.push(`/tracks/${trackId}`);
          }, 1000);
        } finally {
          setIsSaving(false);
        }
      }
    } else {
      // Not checked yet -> Check the answer!
      if (!selectedAnswer) return;
      const answered = answersForCurrentQ.find(a => a.id === selectedAnswer);
      if (answered) {
        checkAnswer(answered.is_correct);
        if (!answered.is_correct) {
          decrementHeart();
        }
      }
    }
  };

  if (isFinished) {
    if (isSaving) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background relative z-50 p-6">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-6 max-w-lg w-full"
          >
            <div className="w-32 h-32 mx-auto rounded-full bg-xp flex items-center justify-center mb-8 shadow-xl shadow-xp/20">
              <span className="text-6xl">⏳</span>
            </div>
            <h1 className="text-4xl font-extrabold text-foreground">Finishing up...</h1>
            <p className="text-sm font-bold text-xp animate-pulse uppercase tracking-wider">
              Saving progress to Database...
            </p>
          </motion.div>
        </div>
      );
    }

    if (earnedData) {
      return (
        <LessonComplete 
           xp={earnedData.xp} 
           stars={earnedData.stars} 
           streak={earnedData.streak} 
           achievements={earnedData.achievements} 
           trackId={trackId} 
        />
      );
    }
    
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-32">
      <ProgressBar trackId={trackId} />

      {!isChecking && (
         <AIMentor 
           question={currentQuestion} 
           currentAnswer={selectedAnswer ? answersForCurrentQ.find(a => a.id === selectedAnswer)?.answer_text : undefined} 
         />
      )}

      <main className="flex-1 flex flex-col justify-center px-4 md:px-8 max-w-4xl mx-auto w-full pt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id} // Forces re-animation when question changes
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {currentQuestion.question_type === 'multiple_choice' && (
              <MultipleChoice 
                question={currentQuestion} 
                answers={answersForCurrentQ} 
              />
            )}
            
            {/* Future support for other types: */}
            {currentQuestion.question_type !== 'multiple_choice' && (
              <div className="p-8 border-2 border-dashed border-border rounded-xl text-center">
                Implementation for {currentQuestion.question_type} pending.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t-2 border-border/50 bg-background/95 backdrop-blur-md p-4 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
           {!isChecking && <div className="text-muted-foreground hidden sm:block">Select an answer below</div>}
           {isChecking && isCorrect && <div className="text-xp font-bold text-xl hidden sm:block">Correct!</div>}
           {isChecking && !isCorrect && <div className="text-destructive font-bold text-xl hidden sm:block">Incorrect.</div>}
            
           <Button 
             className={cn(
               "w-full sm:w-auto px-12 py-6 text-lg rounded-2xl border-b-4",
               isChecking 
                 ? isCorrect 
                    ? "bg-xp border-xp-foreground hover:bg-xp/90 text-xp-foreground" 
                    : "bg-destructive border-destructive/80 hover:bg-destructive/90"
                 : selectedAnswer 
                    ? "bg-primary border-primary-foreground/20" 
                    : "bg-muted text-muted-foreground border-transparent opacity-50 cursor-not-allowed hover:bg-muted"
             )}
             onClick={handleActionClick}
             disabled={!selectedAnswer && !isChecking}
           >
             {isChecking ? "Continue" : "Check Answer"}
           </Button>
        </div>
      </div>
    </div>
  );
}
