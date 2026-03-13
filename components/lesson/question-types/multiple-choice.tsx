"use client";

import { motion } from "framer-motion";
import { type Question, type Answer } from "@/lib/supabase/queries";
import { cn } from "@/lib/utils";
import { useLessonStore } from "@/lib/store/useLessonStore";

interface MultipleChoiceProps {
  question: Question;
  answers: Answer[];
}

export function MultipleChoice({ question, answers }: MultipleChoiceProps) {
  const { selectedAnswer, selectAnswer, isChecking, isCorrect } = useLessonStore();

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
        {question.question_text}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {answers.map((answer) => {
          const isSelected = selectedAnswer === answer.id;
          
          let stateClass = "bg-card border-border hover:bg-muted/50 cursor-pointer";
          
          if (isSelected && !isChecking) {
             stateClass = "bg-primary/10 border-primary ring-2 ring-primary/20";
          } else if (isChecking) {
             if (answer.is_correct) {
               stateClass = "bg-xp/20 border-xp text-xp-foreground ring-2 ring-xp/50";
             } else if (isSelected && !answer.is_correct) {
               stateClass = "bg-destructive/10 border-destructive text-destructive ring-2 ring-destructive/50 opacity-70";
             } else {
               stateClass = "bg-card border-border opacity-50 cursor-not-allowed";
             }
          }

          return (
            <motion.div
              key={answer.id}
              whileHover={!isChecking && !isSelected ? { scale: 1.02, y: -2 } : {}}
              whileTap={!isChecking ? { scale: 0.98 } : {}}
              onClick={() => !isChecking && selectAnswer(answer.id)}
              className={cn(
                "p-4 md:p-6 rounded-2xl border-2 border-b-4 transition-all duration-200",
                stateClass
              )}
            >
              <div className="flex items-center gap-4">
                <div 
                  className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center font-bold text-sm transition-colors",
                    isSelected ? "border-primary text-primary" : "border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {/* Generate letters A, B, C, D dynamically based on index if desired, here just a circle marker */}
                  <div className={cn(
                     "w-3 h-3 rounded-sm transition-all",
                     isSelected ? "bg-primary scale-100" : "bg-transparent scale-0"
                  )} />
                </div>
                <span className="text-lg font-medium">{answer.answer_text}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {isChecking && question.explanation && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-2xl border-2 mt-8",
            isCorrect ? "bg-xp/10 border-xp/30" : "bg-destructive/10 border-destructive/30"
          )}
        >
          <h4 className={cn(
            "font-bold mb-2",
            isCorrect ? "text-xp-foreground" : "text-destructive"
          )}>
            {isCorrect ? "Excellent!" : "Not quite."}
          </h4>
          <p className="text-foreground font-medium">{question.explanation}</p>
        </motion.div>
      )}
    </div>
  );
}
