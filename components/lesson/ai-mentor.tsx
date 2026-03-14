"use client";

import { useState, useEffect } from "react";
import { useCompletion } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, X, MessageSquare, Loader2 } from "lucide-react";
import { isLessonWeak } from "@/lib/utils/practice-detector";
import type { Question } from "@/lib/supabase/queries";

interface AIMentorProps {
  question: Question;
  currentAnswer?: string;
  options: string[];
  correctAnswer?: string;
  lessonTitle: string;
}

export function AIMentor({ question, currentAnswer, options, correctAnswer, lessonTitle }: AIMentorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState<number | null>(null);
  const [explainsRemaining, setExplainsRemaining] = useState<number | null>(null);
  const [isWeak, setIsWeak] = useState(false);

  useEffect(() => {
    setIsWeak(isLessonWeak(question.lesson_id));
  }, [question.lesson_id]);

  const { completion, complete, isLoading, error } = useCompletion({
    api: "/api/ai/hint",
    streamProtocol: "text",
    fetch: async (url, options) => {
      const res = await fetch(url, options);
      // Parse our secure rate-limit metadata from the streaming response headers
      const hintsHeader = res.headers.get("x-hints-remaining");
      const explainsHeader = res.headers.get("x-explains-remaining");
      if (hintsHeader) setHintsRemaining(parseInt(hintsHeader, 10));
      if (explainsHeader) setExplainsRemaining(parseInt(explainsHeader, 10));
      return res;
    },
    onError: (err: Error) => {
      console.error("Mentor Stream Error:", err);
    }
  });

  const requestHint = (mode: "hint" | "explain" = "hint") => {
      complete(question.question_text, {
      body: {
        questionType: question.question_type,
        userAnswer: currentAnswer,
        options,
        correctAnswer,
        lessonTitle,
        lessonId: question.lesson_id,
        mode,
        isWeakLesson: isWeak
      }
    });
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!completion && !isLoading && !error) {
      requestHint("hint");
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <motion.div
           initial={{ scale: 0, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ delay: 0.5, type: 'spring' }}
           className="fixed bottom-28 right-6 md:right-12 z-50 flex flex-col items-center gap-2 group"
        >
          <div className="bg-foreground text-background text-xs font-bold px-3 py-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap -translate-y-2 pointer-events-none">
            Get a Hint
          </div>
          <Button
            onClick={handleOpen}
            size="icon"
            className="w-16 h-16 rounded-full bg-indigo-500 hover:bg-indigo-600 border-4 border-indigo-400/30 shadow-xl shadow-indigo-500/20 active:scale-95 transition-all text-white relative z-50"
          >
            <Sparkles className="w-8 h-8 drop-shadow-md" />
          </Button>
        </motion.div>
      )}

      {/* Chat Modal Layer */}
      <AnimatePresence>
        {isOpen && (
           <motion.div 
             initial={{ opacity: 0, y: 50, scale: 0.9 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, scale: 0.9, y: 50 }}
             className="fixed bottom-28 right-6 md:right-12 z-50 w-[90%] md:w-[400px] bg-card border-2 border-indigo-200 shadow-2xl rounded-3xl overflow-hidden flex flex-col origin-bottom-right"
           >
             {/* Header */}
             <div className="bg-indigo-500 p-4 flex justify-between items-center text-white">
               <div className="flex items-center gap-2 font-bold">
                 <Sparkles className="w-5 h-5 text-indigo-200" />
                 AI Mentor
               </div>
               <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-indigo-600 rounded-full h-8 w-8">
                 <X className="w-4 h-4" />
               </Button>
             </div>

             {/* Content Body */}
             <div className="p-6 bg-indigo-50/50 min-h-[150px] flex flex-col justify-center relative">
                {isLoading && !completion ? (
                  <div className="flex flex-col items-center justify-center text-indigo-400 space-y-4">
                     <Loader2 className="w-8 h-8 animate-spin" />
                     <p className="text-sm font-medium animate-pulse">Thinking Socratic thoughts...</p>
                  </div>
                ) : error ? (
                  <div className="text-center space-y-4">
                     <div className="text-destructive font-bold">{error.message || "Failed to fetch hint"}</div>
                     <Button variant="outline" size="sm" onClick={() => requestHint("hint")}>Try Again</Button>
                  </div>
                ) : completion ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 bg-white p-4 rounded-2xl rounded-tl-none border border-indigo-100 shadow-sm relative">
                       <p className="text-indigo-950 font-medium text-sm leading-relaxed">{completion}</p>
                    </div>
                    {hintsRemaining !== null && explainsRemaining !== null && (
                       <div className="flex justify-around mt-2">
                         <p className="text-xs font-bold text-indigo-400/80 uppercase tracking-widest">
                           {hintsRemaining} Hints Left
                         </p>
                         <p className="text-xs font-bold text-emerald-400/80 uppercase tracking-widest">
                           {explainsRemaining} Explanations Left
                         </p>
                       </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-4 opacity-50">
                    <MessageSquare className="w-8 h-8 mx-auto" />
                    <p className="text-sm">Click below to ask for a hint!</p>
                  </div>
                )}
             </div>

             {/* Footer Interaction */}
             <div className="p-4 bg-background border-t border-indigo-100 flex flex-col sm:flex-row justify-end gap-2">
                <Button 
                   variant="outline" 
                   onClick={() => requestHint("hint")} 
                   disabled={isLoading || (hintsRemaining !== null && hintsRemaining <= 0)}
                   className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Hint
                </Button>
                <Button 
                   variant="outline" 
                   onClick={() => requestHint("explain")} 
                   disabled={isLoading || (explainsRemaining !== null && explainsRemaining <= 0)}
                   className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50 mt-3 sm:mt-0"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Explain Concept
                </Button>
             </div>
           </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
