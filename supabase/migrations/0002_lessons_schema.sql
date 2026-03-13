-- 0002_lessons_schema.sql
-- Checkpoint 5: Lesson System Architecture

-- Create lessons table
-- Wrapper for the educational sequence within a specific level map node
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    level_id UUID REFERENCES public.levels(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    lesson_type TEXT NOT NULL, -- e.g., 'concept', 'quiz', 'coding', 'flashcard'
    lesson_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create questions table
-- Interactive nodes within a lesson
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    question_type TEXT NOT NULL, -- e.g., 'multiple_choice', 'true_false', 'code', 'fill_blank'
    question_text TEXT NOT NULL,
    explanation TEXT, -- shown after answer is given
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create answers table
-- Normalized queryable answer choices for the questions
CREATE TABLE IF NOT EXISTS public.answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false NOT NULL
);

-- Run ROW LEVEL SECURITY (RLS)
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- These structural components should be readable by all authenticated (and public) users
CREATE POLICY "Allow public read access on lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Allow public read access on questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Allow public read access on answers" ON public.answers FOR SELECT USING (true);
