"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface MapContainerProps {
  children: ReactNode;
  progressPercentage?: number;
}

export function MapContainer({ children, progressPercentage = 0 }: MapContainerProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-card/50 rounded-3xl shadow-sm border-2 border-border overflow-hidden min-h-[70vh] relative">
      <div className="w-full h-full px-8 py-16 relative flex flex-col">
        {/* Background vertical line track */}
        <div className="absolute top-12 bottom-12 left-1/2 w-0 border-l-4 border-dashed border-muted-foreground/30 -translate-x-1/2 z-0" />
        
        {/* Animated actual progress filled line */}
        <div className="absolute top-12 bottom-12 left-1/2 w-0 flex items-end -translate-x-1/2 z-0">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: `${progressPercentage}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-1 border-l-4 border-emerald-400 absolute bottom-0 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
          />
        </div>
        
        {children}
      </div>
    </div>
  );
}
