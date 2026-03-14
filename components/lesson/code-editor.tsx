"use client";

// No react imports needed
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  language?: string;
  initialValue?: string;
  onChange?: (code: string | undefined) => void;
  height?: string;
}

export function CodeEditor({ 
  language = "python", 
  initialValue = "", 
  onChange,
  height = "300px" 
}: CodeEditorProps) {
  const handleEditorDidMount = () => {
    // Editor mounted callback
  };

  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-md">
      {/* Editor Header Bar for styling */}
      <div className="bg-[#1e1e1e] border-b border-[#333] px-4 py-2 flex items-center justify-between pointer-events-none">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="text-xs text-muted-foreground font-mono font-medium opacity-50 uppercase tracking-widest px-2">
          {language}
        </div>
      </div>
      
      {/* Container specifically forces correct background during loading */}
      <div className="bg-[#1e1e1e] w-full" style={{ height }}>
         <Editor
           height={height}
           defaultLanguage={language}
           defaultValue={initialValue}
           theme="vs-dark"
           onChange={onChange}
           onMount={handleEditorDidMount}
           options={{
             minimap: { enabled: false },
             fontSize: 16,
             lineHeight: 24,
             padding: { top: 16, bottom: 16 },
             scrollBeyondLastLine: false,
             smoothScrolling: true,
             cursorBlinking: "smooth",
             cursorSmoothCaretAnimation: "on",
             formatOnPaste: true,
           }}
           loading={
             <div className="flex items-center justify-center w-full h-full text-muted-foreground/50 text-sm font-medium">
               Initializing IDE Environment...
             </div>
           }
         />
      </div>
    </div>
  );
}
