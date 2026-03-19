"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/lesson/code-editor";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle2 } from "lucide-react";
import type { Question } from "@/lib/supabase/queries";
import { cn } from "@/lib/utils";
import { simulatePythonOutput } from "@/lib/utils/code-executor";

interface CodeChallengeProps {
   question: Question;
   expectedOutput?: string; // e.g: "Hello\n"
   onCorrect: (userCode: string) => void;
   onIncorrect: (userCode: string) => void;
   isChecking: boolean;
}

export function CodeChallenge({ question, expectedOutput, onCorrect, onIncorrect, isChecking }: CodeChallengeProps) {
    const [code, setCode] = useState<string>("");
    const [output, setOutput] = useState<string | null>(null);

    const handleRunCode = () => {
        const out = simulatePythonOutput(code);
        setOutput(out);
    };

    const handleCheckAnswer = () => {
        const out = simulatePythonOutput(code);
        setOutput(out);
        
        if (!expectedOutput) return;
        
        // Exact string equality check (ignoring only trailing newlines if necessary, but exact matching is safer)
        if (out.trim() === expectedOutput.trim()) {
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

              {/* Output block */}
              {output !== null && (
                 <div className="bg-muted rounded-lg p-3 text-sm font-mono mt-3 max-w-3xl mx-auto shadow-inner border border-border">
                    <div className="text-muted-foreground mb-1 select-none border-b border-border/50 pb-1">Your Output</div>
                    <div className="whitespace-pre-wrap">{output || " "}</div>
                 </div>
              )}

              {/* Action Button Block */}
              <div className="flex justify-center pt-4 gap-4">
                  <Button 
                     size="lg" 
                     onClick={handleRunCode}
                     disabled={isChecking || code.trim().length === 0}
                     variant="outline"
                     className={cn(
                        "px-8 py-6 rounded-2xl border-b-4 text-xl font-bold transition-all shadow-sm flex items-center gap-2",
                        code.trim().length > 0
                           ? "text-foreground hover:bg-muted"
                           : "opacity-50 cursor-not-allowed"
                     )}
                  >
                     <Play className="w-5 h-5 fill-current" />
                     Run Code
                  </Button>

                  <Button 
                     size="lg" 
                     onClick={handleCheckAnswer}
                     disabled={isChecking || code.trim().length === 0}
                     className={cn(
                        "px-8 py-6 rounded-2xl border-b-4 text-xl font-bold transition-all shadow-sm flex items-center gap-2",
                        code.trim().length > 0
                           ? "bg-emerald-500 hover:bg-emerald-600 border-emerald-700 text-white"
                           : "bg-muted text-muted-foreground border-transparent opacity-50 cursor-not-allowed hover:bg-muted"
                     )}
                  >
                     <CheckCircle2 className="w-5 h-5" />
                     {isChecking ? "Checking..." : "Check Answer"}
                  </Button>
              </div>
           </div>
       </div>
    );
}
