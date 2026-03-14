"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface FeedbackPanelProps {
  isCorrect: boolean;
  onContinue: () => void;
}

export function FeedbackPanel({ isCorrect, onContinue }: FeedbackPanelProps) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", duration: 0.35 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 border-t-2 z-50 p-6 shadow-lg",
        isCorrect ? "bg-green-100 border-green-300 dark:bg-green-950 dark:border-green-900" 
                  : "bg-red-100 border-red-300 dark:bg-red-950 dark:border-red-900"
      )}
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl text-white",
            isCorrect ? "bg-green-500" : "bg-red-500"
          )}>
            {isCorrect ? <Check className="w-8 h-8" /> : <X className="w-8 h-8" />}
          </div>
          <div>
            {isCorrect ? (
              <>
                <h3 className="text-2xl font-black text-green-700 dark:text-green-400">Correct!</h3>
                <div className="text-green-600 dark:text-green-500 font-bold mt-1">
                  +20 XP Earned &nbsp;•&nbsp; ⭐ +2 Stars
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-black text-red-700 dark:text-red-400">Not quite!</h3>
                <div className="text-red-600 dark:text-red-500 font-bold mt-1">
                  Try again or ask the AI Mentor.
                </div>
              </>
            )}
          </div>
        </div>

        <Button 
          onClick={onContinue}
          className={cn(
            "w-full md:w-auto px-12 py-6 text-xl rounded-2xl border-b-4 font-bold text-white shadow-sm",
            isCorrect 
              ? "bg-green-500 hover:bg-green-600 border-green-700" 
              : "bg-red-500 hover:bg-red-600 border-red-700"
          )}
        >
          {isCorrect ? "Continue →" : "Try Again"}
        </Button>
      </div>
    </motion.div>
  );
}
