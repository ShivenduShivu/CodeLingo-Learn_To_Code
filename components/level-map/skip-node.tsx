"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SkipNodeProps {
  trackId: string;
}

export function SkipNode({ trackId }: SkipNodeProps) {
  return (
    <div className="relative flex justify-center w-full z-10 mb-8 mt-4">
      <Link href={`/skip-test/${trackId}`}>
        <motion.div
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
        >
          <Button variant="outline" className="rounded-2xl border-2 border-primary text-primary hover:bg-primary/10 h-16 px-8 shadow-sm group bg-background">
            <Zap className="w-6 h-6 mr-3 text-primary group-hover:fill-primary/20 transition-all" />
            <div className="flex flex-col items-start gap-0.5">
               <span className="font-extrabold text-sm uppercase tracking-wider">Test Out</span>
            </div>
          </Button>
        </motion.div>
      </Link>
    </div>
  );
}
