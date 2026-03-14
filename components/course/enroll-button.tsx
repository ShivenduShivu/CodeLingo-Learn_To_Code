"use client";

import { useTransition } from "react";
import { enroll } from "@/app/actions/enroll";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";

interface EnrollButtonProps {
  courseId: string;
}

export function EnrollButton({ courseId }: EnrollButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the parent <Link> from firing instantly
    startTransition(async () => {
      await enroll(courseId);
    });
  };

  return (
    <Button 
      onClick={handleEnroll} 
      disabled={isPending}
      className="w-full mt-4 bg-primary/10 text-primary hover:bg-primary/20 font-bold tracking-wide border-2 border-primary/20 hover:border-primary/40 rounded-xl"
    >
      {isPending ? (
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      ) : (
        <PlusCircle className="w-5 h-5 mr-2" />
      )}
      Enroll Now
    </Button>
  );
}
