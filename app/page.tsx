import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-sans text-center flex flex-col">
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl text-primary mb-6 animate-float">
          Learn Python & ML
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
          The gamified way to master coding, machine learning, and AI building.
        </p>
        <Link href="/login">
          <Button className="font-bold text-xl px-12 py-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all animate-button-bounce">
            Get Started
          </Button>
        </Link>
      </div>
    </main>
  );
}
