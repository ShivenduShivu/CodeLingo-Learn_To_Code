import { NextResponse } from 'next/server';
import { generateHintStream } from '@/lib/ai/hints';
import { createClient } from '@/lib/supabase/server';

// Extremely basic in-memory rate limiting mechanism (By UserId + LessonId)
// In a true massively-scaled production app this would use Redis/Upstash.
const rateLimitStore = new Map<string, { hints: number, explains: number, resetAt: number }>();
const HINTS_PER_LESSON = 2;
const EXPLAINS_PER_LESSON = 1;
const SESSION_DURATION_MS = 1000 * 60 * 60 * 2; // 2 Hours

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse Minimal Context Request
    const body = await req.json();
    const { 
       prompt: questionText, 
       questionType, 
       userAnswer, 
       options = [], 
       correctAnswer, 
       lessonTitle, 
       lessonId,
       mode = "hint",
       isWeakLesson = false
    } = body;

    if (!questionText || !lessonId) {
      return NextResponse.json({ error: 'Missing required question syntax or lesson scope.' }, { status: 400 });
    }

    // 1. Enforce Rate Limiting Server-Side
    const now = Date.now();
    const limitKey = `${user.id}:${lessonId}`;
    let userLimit = rateLimitStore.get(limitKey);

    if (userLimit && now > userLimit.resetAt) {
      userLimit = undefined; // Expire it
    }

    if (!userLimit) {
      userLimit = { hints: 0, explains: 0, resetAt: now + SESSION_DURATION_MS };
    }

    if (mode === "explain" && userLimit.explains >= EXPLAINS_PER_LESSON) {
      return NextResponse.json(
        { error: 'Explanation limit exceeded for this lesson.' }, 
        { status: 429 }
      );
    } else if (mode === "hint" && userLimit.hints >= HINTS_PER_LESSON) {
      return NextResponse.json(
        { error: 'Hint limit exceeded for this lesson.' }, 
        { status: 429 }
      );
    }

    // Increment Usage only when we successfully validate expectations
    if (mode === "explain") {
       userLimit.explains += 1;
    } else {
       userLimit.hints += 1;
    }
    rateLimitStore.set(limitKey, userLimit);

    // 3. Trigger generic AI Service helper for a Streaming Text response
    const result = await generateHintStream(
      questionText, 
      questionType || 'multiple_choice', 
      userAnswer,
      options,
      correctAnswer,
      lessonTitle,
      mode,
      isWeakLesson
    );
    
    // Convert to a stream response, injecting the safe headers so the UI can parse remaining counts
    return result.toTextStreamResponse({
       headers: {
          'x-hints-remaining': String(HINTS_PER_LESSON - userLimit.hints),
          'x-explains-remaining': String(EXPLAINS_PER_LESSON - userLimit.explains)
       }
    });

  } catch (error) {
    console.error("AI ERROR:", error);
    console.error('Hint API Route Error TRACE:', error);
    return NextResponse.json({ error: 'Internal server error generating hint.' }, { status: 500 });
  }
}
