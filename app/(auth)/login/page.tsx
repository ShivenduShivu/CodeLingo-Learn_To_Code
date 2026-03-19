"use client";

import { login } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { Github, Loader2, Chrome } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await login(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Welcome Back!</h1>
        <p className="text-muted-foreground">Keep your streak alive. Sign in to your account.</p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-bold">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="you@example.com" 
            required 
            className="h-12 border-2 rounded-xl focus-visible:ring-primary focus-visible:ring-offset-2"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="font-bold">Password</Label>
            <Link href="#" className="text-sm text-primary font-bold hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            required 
            className="h-12 border-2 rounded-xl focus-visible:ring-primary focus-visible:ring-offset-2"
          />
        </div>

        {error && (
          <Alert variant="destructive" className="border-2 rounded-xl">
            <AlertDescription className="font-semibold">{error}</AlertDescription>
          </Alert>
        )}

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 text-lg font-bold rounded-xl shadow-[0_4px_0_hsl(var(--primary-foreground)/0.2)] hover:translate-y-[2px] hover:shadow-[0_2px_0_hsl(var(--primary-foreground)/0.2)] transition-all active:translate-y-[4px] active:shadow-none bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In"}
          </Button>
        </motion.div>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t-2" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-4 text-muted-foreground font-bold">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button" className="h-12 border-2 rounded-xl border-border hover:bg-secondary font-bold" disabled>
          <Github className="mr-2 h-5 w-5" />
          Github
        </Button>
        <Button 
          variant="outline" 
          type="button" 
          className="h-12 border-2 rounded-xl border-border hover:bg-secondary font-bold"
          onClick={handleGoogleLogin}
        >
          <Chrome className="mr-2 h-5 w-5 text-blue-500" />
          Google
        </Button>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground font-medium">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary font-bold hover:underline">
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
