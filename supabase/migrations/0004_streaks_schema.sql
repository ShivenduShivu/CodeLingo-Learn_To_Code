-- 0004_streaks_schema.sql
-- Checkpoint 7: Progression Engine (XP & Level Unlocks)
-- Adding streak tracking to the existing user_progress table

ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0;
