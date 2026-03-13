-- Achievements Table (Global dictionary of possible unlocks)
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User Achievements Table (User's unlocked log)
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT user_achievements_user_id_achievement_id_key UNIQUE (user_id, achievement_id) 
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Policies for Achievements (Read-only for all users)
CREATE POLICY "Achievements are readable by everyone." 
  ON public.achievements FOR SELECT USING (true);

-- Policies for User Achievements (Users can read their own, Server Actions insert them)
CREATE POLICY "Users can read their own achievements." 
  ON public.user_achievements FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements (via server action)." 
  ON public.user_achievements FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Seed Initial Achievements
INSERT INTO public.achievements (name, description, icon, condition_type, condition_value, xp_reward) VALUES 
('First Step', 'Complete your very first lesson.', '🎯', 'FIRST_LESSON', 1, 10),
('Novice Explorer', 'Accumulate a total of 50 XP.', '⭐', 'XP_GAINED', 50, 20),
('Scholar', 'Accumulate a total of 250 XP.', '🎓', 'XP_GAINED', 250, 50),
('On Fire', 'Reach a 3-day learning streak.', '🔥', 'STREAK_MILESTONE', 3, 30),
('Flawless Victory', 'Complete a lesson with 100% accuracy (3 stars).', '👑', 'PERFECT_LESSON', 1, 20),
('Track Master', 'Skip a track by passing the comprehensive exam.', '⚡', 'TRACK_SKIPPED', 1, 50);

-- Notify purely to refresh cache if needed
NOTIFY pgrst, 'reload_schema';
