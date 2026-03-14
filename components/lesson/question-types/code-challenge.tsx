"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/lesson/code-editor";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import type { Question } from "@/lib/supabase/queries";
import { cn } from "@/lib/utils";

interface CodeChallengeProps {
   question: Question;
   expectedOutput?: string; // e.g: "Hello\n"
   onCorrect: (userCode: string) => void;
   onIncorrect: (userCode: string) => void;
   isChecking: boolean;
}

export function CodeChallenge({ question, expectedOutput, onCorrect, onIncorrect, isChecking }: CodeChallengeProps) {
    const [code, setCode] = useState<string>("");

    const handleRunCode = () => {
        // MVP Evaluation Engine
        // Verifies if the user's code inherently "includes" the expected generic output strings 
        // Note: For a true prod app, we'd deploy Pyodide or a secure Docker sandbox execution API here.
        if (!expectedOutput) return;

        // Strip whitespaces generically for simple validations
        const cleanUserCode = code.trim();
        const cleanExpected = expectedOutput.trim();

        if (cleanUserCode.includes(cleanExpected)) {
           onCorrect(code);
        } else {
           onIncorrect(code);
        }
    };

    return (
       <div className="w-full flex justify-center items-center py-8">
           <div className="w-full space-y-8">
              {/* Question Text Label */}
              <div className="text-xl md:text-3xl font-extrabold text-foreground tracking-tight text-center max-w-2xl mx-auto leading-relaxed">
                 {question.question_text}
              </div>

              {/* Advanced Code Editor Block */}
              <div className="w-full max-w-3xl mx-auto shadow-2xl rounded-xl">
                 <CodeEditor 
                    language="python"
                    onChange={(val) => setCode(val || "")}
                    height="350px"
                 />
              </div>

              {/* Action Button Block */}
              <div className="flex justify-center pt-4">
                  <Button 
                     size="lg" 
                     onClick={handleRunCode}
                     disabled={isChecking || code.trim().length === 0}
                     className={cn(
                        "px-8 py-6 rounded-2xl border-b-4 text-xl font-bold transition-all shadow-sm flex items-center gap-3",
                        code.trim().length > 0
                           ? "bg-emerald-500 hover:bg-emerald-600 border-emerald-700 text-white"
                           : "bg-muted text-muted-foreground border-transparent opacity-50 cursor-not-allowed hover:bg-muted"
                     )}
                  >
                     <Play className="w-5 h-5 fill-current" />
                     {isChecking ? "Checking..." : "Run Code"}
                  </Button>
              </div>
           </div>
       </div>
    );
}
