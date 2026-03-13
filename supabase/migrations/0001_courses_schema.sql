-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    color_hex TEXT DEFAULT '#1CB0F6',
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create tracks table (Beginner, Intermediate, Advanced)
-- Course has many tracks
CREATE TABLE IF NOT EXISTS public.tracks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    difficulty_level TEXT NOT NULL, -- e.g., 'Beginner', 'Intermediate', 'Advanced'
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create levels table (nodes on the map)
-- Track has many levels
CREATE TABLE IF NOT EXISTS public.levels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE,
    level_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    xp_reward INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(track_id, level_number)
);

-- Create user_progress table
-- Tracks aggregate progression for a user in a specific course
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE,
    current_level INTEGER DEFAULT 1,
    hearts_remaining INTEGER DEFAULT 5,
    total_xp INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, course_id, track_id)
);

-- Create level_progress table
-- Tracks completion and stars for individual levels
CREATE TABLE IF NOT EXISTS public.level_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    level_id UUID REFERENCES public.levels(id) ON DELETE CASCADE,
    stars_earned INTEGER DEFAULT 0 CHECK (stars_earned >= 0 AND stars_earned <= 3),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, level_id)
);

-- Run RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_progress ENABLE ROW LEVEL SECURITY;

-- Courses, Tracks, and Levels are readable by everyone
CREATE POLICY "Allow public read access on courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow public read access on tracks" ON public.tracks FOR SELECT USING (true);
CREATE POLICY "Allow public read access on levels" ON public.levels FOR SELECT USING (true);

-- User Progress is readable and updatable only by the owner
CREATE POLICY "Users can read own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Level Progress is readable and updatable only by the owner
CREATE POLICY "Users can read own level progress" ON public.level_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own level progress" ON public.level_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own level progress" ON public.level_progress FOR UPDATE USING (auth.uid() = user_id);
