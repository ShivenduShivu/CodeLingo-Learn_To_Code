-- Create level_progress table to track individual level completions
CREATE TABLE IF NOT EXISTS public.level_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    level_id UUID REFERENCES public.levels(id) ON DELETE CASCADE,
    stars_earned INTEGER DEFAULT 0 CHECK (stars_earned >= 0 AND stars_earned <= 3),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, level_id)
);

-- Enable RLS
ALTER TABLE public.level_progress ENABLE ROW LEVEL SECURITY;

-- Create Policies
DROP POLICY IF EXISTS "Users can read own level progress" ON public.level_progress;
CREATE POLICY "Users can read own level progress" ON public.level_progress FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own level progress" ON public.level_progress;
CREATE POLICY "Users can insert own level progress" ON public.level_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own level progress" ON public.level_progress;
CREATE POLICY "Users can update own level progress" ON public.level_progress FOR UPDATE USING (auth.uid() = user_id);

-- Force Supabase to reload its schema cache
NOTIFY pgrst, 'reload_schema';
