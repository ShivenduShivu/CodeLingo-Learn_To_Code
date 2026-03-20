"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/lesson/code-editor";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle2 } from "lucide-react";
import type { Question } from "@/lib/supabase/queries";
import { cn } from "@/lib/utils";
import { simulatePythonOutput } from "@/lib/utils/code-executor";

function normalize(str: string) {
  // Convert literal backslash-n to actual newlines, then trim trailing whitespaces
  return str.replace(/\\n/g, "\n").trim().replace(/\r\n/g, "\n").replace(/\s+$/gm, "");
}

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
    const [showMismatch, setShowMismatch] = useState(false);

    const handleRunCode = () => {
        const out = simulatePythonOutput(code);
        setOutput(out);
        setShowMismatch(false);
    };

    const handleCheckAnswer = () => {
        const out = simulatePythonOutput(code);
        setOutput(out);
        
        if (!expectedOutput) return;

        console.log("USER:", JSON.stringify(out));
        console.log("EXPECTED:", JSON.stringify(expectedOutput));

        const isCorrect = normalize(out) === normalize(expectedOutput);

        if (isCorrect) {
           setShowMismatch(false);
           onCorrect(code);
        } else {
           setShowMismatch(true);
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
                  <div className="bg-gray-100 rounded-lg p-3 text-sm font-mono mt-3 max-w-3xl mx-auto shadow-inner border border-gray-300 text-gray-800">
                     <div className="text-gray-600 font-bold mb-1 select-none border-b border-gray-300 pb-1">Your Output</div>
                     <div className="whitespace-pre-wrap text-black font-semibold">{output || " "}</div>
                     {showMismatch && expectedOutput && (
                        <div className="mt-4 pt-4 border-t border-gray-300 text-red-500 whitespace-pre-wrap font-bold">
                           <div>Expected: {expectedOutput}</div>
                           <div>Got: {output}</div>
                        </div>
                     )}
                  </div>
               )}

              {/* Action Button Block */}
              <div className="flex justify-center pt-4 gap-4">
                  <Button 
                     size="lg" 
                     onClick={handleRunCode}
                     disabled={isChecking || code.trim().length === 0}
                     className="px-8 py-6 rounded-2xl border-2 border-b-4 text-xl font-bold transition-all shadow-sm flex items-center gap-2 bg-white border-gray-300 text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     <Play className="w-5 h-5 fill-current" />
                     Run Code
                  </Button>

                  <Button 
                     size="lg" 
                     onClick={handleCheckAnswer}
                     disabled={isChecking || code.trim().length === 0}
                     className="px-8 py-6 rounded-2xl border-2 border-b-4 text-xl font-bold transition-all shadow-sm flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 border-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     <CheckCircle2 className="w-5 h-5" />
                     {isChecking ? "Checking..." : "Check Answer"}
                  </Button>
              </div>
           </div>
       </div>
    );
}
