"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
}

export function GlassCard({ children, className, hoverScale = 1.02 }: GlassCardProps) {
  return (
    <motion.div 
      whileHover={{ scale: hoverScale, rotateX: 5, rotateY: 5 }} 
      className={cn("bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl transition-all hover:shadow-2xl text-white", className)}
    >
      {children}
    </motion.div>
  );
}
