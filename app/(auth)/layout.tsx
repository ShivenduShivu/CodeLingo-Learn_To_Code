"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Gamified Panel - Hidden on Mobile */}
      <div className="hidden lg:flex flex-col flex-1 bg-primary relative overflow-hidden items-center justify-center p-12">
        <motion.div 
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent"
        />
        
        {/* Subtle animated background shapes */}
        <motion.div 
          className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white/10 blur-xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-40 right-20 w-48 h-48 rounded-full bg-accent/20 blur-2xl flex"
          animate={{ scale: [1, 1.5, 1], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="relative z-10 text-center max-w-lg">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center mb-8"
          >
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-xl border border-white/30 text-white">
                <BookOpen className="w-12 h-12" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl font-extrabold text-white tracking-tight leading-tight mb-6"
          >
            Learn AI and Programming With CodeLingo
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-primary-foreground/80 text-xl font-medium"
          >
            Bite-sized lessons, interactive challenges, and a streak to defend.
          </motion.p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 relative">
        <div className="w-full max-w-md">
            {children}
        </div>
      </div>
    </div>
  );
}
