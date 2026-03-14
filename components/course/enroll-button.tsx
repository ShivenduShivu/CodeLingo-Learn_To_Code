"use client";

import { useFormStatus } from "react-dom";
import { enroll } from "@/app/actions/enroll";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";

interface EnrollButtonProps {
  courseId: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit"
      disabled={pending}
      className="w-full mt-4 bg-primary/10 text-primary hover:bg-primary/20 font-bold tracking-wide border-2 border-primary/20 hover:border-primary/40 rounded-xl"
    >
      {pending ? (
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      ) : (
        <PlusCircle className="w-5 h-5 mr-2" />
      )}
      Enroll Now
    </Button>
  );
}

export function EnrollButton({ courseId }: EnrollButtonProps) {
  const submitAction = async () => {
    const result = await enroll(courseId);
    if (result && result.error) {
       alert("Enrollment Failed: " + result.error);
       console.error(result.error);
    }
  };

  return (
    <form action={submitAction} onClick={(e) => e.stopPropagation()}>
      <SubmitButton />
    </form>
  );
}
