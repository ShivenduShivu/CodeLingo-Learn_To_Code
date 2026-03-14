"use server";

import { createClient } from "@/lib/supabase/server";
import { checkAchievements } from "@/lib/achievements/evaluator";

export async function completeLevel(levelId: string, correctCount: number, totalQuestions: number) {
  const supabase = createClient();
  
  // 1. Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.warn("Progress Action Auth Error:", authError?.message || "No user found");
    return { success: false, error: 'Not authenticated' };
  }

  // 2. Fetch the level details to get track_id and xp_reward
  const { data: levelData, error: levelError } = await supabase
    .from('levels')
    .select('*, tracks(course_id)')
    .eq('id', levelId)
    .single();

  if (levelError || !levelData || !levelData.tracks) {
    throw new Error('Level not found');
  }

  const courseId = levelData.tracks.course_id;
  const trackId = levelData.track_id;
  const xpReward = levelData.xp_reward || 10;

  // 3. Calculate Stars & Total XP based on Accuracy
  const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) : 0;
  let stars = 0;
  if (accuracy >= 0.9) stars = 3;
  else if (accuracy >= 0.7) stars = 2;
  else if (accuracy >= 0.5) stars = 1;
  else stars = 0;

  const xpEarned = xpReward + (stars * 5);

  // 4. Update Level Progress (UPSERT)
  const { error: lpError } = await supabase
    .from('level_progress')
    .upsert(
      { 
        user_id: user.id, 
        level_id: levelId, 
        stars_earned: stars, 
        completed_at: new Date().toISOString() 
      },
      { onConflict: 'user_id, level_id' }
    );

  if (lpError) {
    console.error("level_progress error", lpError);
    throw new Error('Failed to save level progress');
  }

  // 5. Update or Create User Progress (Streak & XP Logic)
  // Fetch existing
  const { data: existingProgress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .eq('track_id', trackId)
    .single();

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  let newStreak = 1;
  let newXp = xpEarned;

  if (existingProgress) {
    newXp = (existingProgress.total_xp || 0) + xpEarned;
    
    // Streak logic
    if (existingProgress.last_activity) {
      const lastActivityDate = new Date(existingProgress.last_activity);
      const lastActivityDay = lastActivityDate.toISOString().split('T')[0];
      
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterday = yesterdayDate.toISOString().split('T')[0];

      if (lastActivityDay === today) {
         // Keep current streak if played multiple times today
         newStreak = existingProgress.streak_count || 1;
      } else if (lastActivityDay === yesterday) {
         // Increment if played yesterday
         newStreak = (existingProgress.streak_count || 1) + 1;
      } else {
         // Reset to 1 otherwise
         newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    // Update existing user_progress
    await supabase
      .from('user_progress')
      .update({
        total_xp: newXp,
        streak_count: newStreak,
        last_activity: now.toISOString(),
      })
      .eq('id', existingProgress.id);

  } else {
    // Insert new user_progress if playing for the very first time on this track
    await supabase
      .from('user_progress')
      .insert({
        user_id: user.id,
        course_id: courseId,
        track_id: trackId,
        current_level: levelData.level_number,
        total_xp: newXp,
        streak_count: newStreak,
        last_activity: now.toISOString(),
      });
  }

  // Update global user total_xp
  const { data: globalUserData } = await supabase
    .from('users')
    .select('total_xp')
    .eq('id', user.id)
    .single();

  if (globalUserData) {
    await supabase
      .from('users')
      .update({ total_xp: (globalUserData.total_xp || 0) + xpEarned })
      .eq('id', user.id);
  }

  // 6. Check Achievements (Event-driven broadcast)
  const unlockPromises = [
    checkAchievements(user.id, 'FIRST_LESSON', 1),
    checkAchievements(user.id, 'XP_GAINED', newXp),
    checkAchievements(user.id, 'STREAK_MILESTONE', newStreak)
  ];
  if (stars === 3) {
    unlockPromises.push(checkAchievements(user.id, 'PERFECT_LESSON', 1));
  }

  const unlockResults = await Promise.all(unlockPromises);
  const newAchievements = unlockResults.flat();

  return { success: true, earnedXp: xpEarned, stars, newStreak, newAchievements };
}
