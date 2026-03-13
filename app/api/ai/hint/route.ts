import { NextResponse } from 'next/server';
import { generateHintStream } from '@/lib/ai/hints';
import { createClient } from '@/lib/supabase/server';

// Extremely basic in-memory rate limiting mechanism (By UserId)
// In a true massively-scaled production app this would use Redis/Upstash.
const rateLimitStore = new Map<string, { count: number, resetAt: number }>();
const HINTS_PER_SESSION = 3;
const SESSION_DURATION_MS = 1000 * 60 * 60; // 1 Hour

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Enforce Rate Limiting Server-Side
    const now = Date.now();
    let userLimit = rateLimitStore.get(user.id);

    if (userLimit && now > userLimit.resetAt) {
      userLimit = undefined; // Expire it
    }

    if (!userLimit) {
      userLimit = { count: 0, resetAt: now + SESSION_DURATION_MS };
    }

    if (userLimit.count >= HINTS_PER_SESSION) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again in an hour!' }, 
        { status: 429 }
      );
    }

    // 2. Parse Minimal Context Request
    const body = await req.json();
    const { prompt: questionText, questionType, userAnswer } = body;

    // Vercel AI SDK 'useCompletion' sends 'prompt' as the variable by default
    if (!questionText) {
      return NextResponse.json({ error: 'Missing required question context.' }, { status: 400 });
    }

    // Increment Usage only when we successfully validate
    userLimit.count += 1;
    rateLimitStore.set(user.id, userLimit);

    // 3. Trigger generic AI Service helper for a Streaming Text response
    const result = await generateHintStream(questionText, questionType || 'multiple_choice', userAnswer);
    
    // Convert to a stream response, injecting the safe headers so the UI can parse remaining counts
    return result.toTextStreamResponse({
       headers: {
          'x-hints-remaining': String(HINTS_PER_SESSION - userLimit.count)
       }
    });

  } catch (error) {
    console.error('Hint API Route Error:', error);
    return NextResponse.json({ error: 'Internal server error generating hint.' }, { status: 500 });
  }
}
