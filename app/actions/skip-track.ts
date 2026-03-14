"use server";

import { createClient } from "@/lib/supabase/server";
import { checkAchievements } from "@/lib/achievements/evaluator";

export async function skipTrack(trackId: string, correctCount: number, totalQuestions: number) {
  const supabase = createClient();
  
  // 1. Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.warn("Skip Action Auth Error:", authError?.message || "No user found");
    return { success: false, error: 'Not authenticated' };
  }

  // 2. Validate parsing score
  if (totalQuestions === 0) {
     return { success: false, error: 'Quiz invalid (0 questions)' };
  }
  
  const scorePercentage = correctCount / totalQuestions;
  if (scorePercentage < 0.85) {
     return { success: false, error: `Score too low to skip! (Got Math.round(scorePercentage * 100)%, Need 85%)` };
  }

  // 3. Fetch all levels for this track to get their IDs and XP rewards
  const { data: levels, error: levelsError } = await supabase
    .from('levels')
    .select('*, tracks(course_id)')
    .eq('track_id', trackId);

  if (levelsError || !levels || levels.length === 0) {
    return { success: false, error: 'Track not found or empty' };
  }

  const courseId = levels[0].tracks?.course_id;

  // Calculate total XP to award (base only)
  let totalXpAwarded = 0;
  const levelProgressUpserts: {
    user_id: string;
    level_id: string;
    stars_earned: number;
    completed_at: string;
  }[] = [];
  const now = new Date();

  for (const level of levels) {
    totalXpAwarded += (level.xp_reward || 10);
    levelProgressUpserts.push({
      user_id: user.id,
      level_id: level.id,
      stars_earned: 1, // Fixed 1 star per user spec to leave room for replay value
      completed_at: now.toISOString()
    });
  }

  // 4. Batch UPSERT into level_progress
  const { error: lpError } = await supabase
    .from('level_progress')
    .upsert(levelProgressUpserts, { onConflict: 'user_id, level_id' });

  if (lpError) {
    console.error("level_progress bulk error", lpError);
    return { success: false, error: 'Failed to unlock levels: ' + lpError.message };
  }

  // 5. Update or Create User Progress (Streak & Mass XP Logic)
  const { data: existingProgress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .eq('track_id', trackId)
    .single();

  const today = now.toISOString().split('T')[0];
  let newStreak = 1;
  let newXp = totalXpAwarded;

  if (existingProgress) {
    newXp = (existingProgress.total_xp || 0) + totalXpAwarded;
    
    // Streak logic
    if (existingProgress.last_activity) {
      const lastActivityDate = new Date(existingProgress.last_activity);
      const lastActivityDay = lastActivityDate.toISOString().split('T')[0];
      
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterday = yesterdayDate.toISOString().split('T')[0];

      if (lastActivityDay === today) {
         newStreak = existingProgress.streak_count || 1;
      } else if (lastActivityDay === yesterday) {
         newStreak = (existingProgress.streak_count || 1) + 1;
      } else {
         newStreak = 1;
      }
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
    // Insert new user_progress
    await supabase
      .from('user_progress')
      .insert({
        user_id: user.id,
        course_id: courseId,
        track_id: trackId,
        current_level: levels[levels.length - 1].level_number, // Assume skipped all
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
      .update({ total_xp: (globalUserData.total_xp || 0) + totalXpAwarded })
      .eq('id', user.id);
  }

  // 6. Check Achievements (Event-driven broadcast)
  const unlockPromises = [
    checkAchievements(user.id, 'FIRST_LESSON', 1),
    checkAchievements(user.id, 'XP_GAINED', newXp),
    checkAchievements(user.id, 'STREAK_MILESTONE', newStreak),
    checkAchievements(user.id, 'TRACK_SKIPPED', 1),
  ];

  const unlockResults = await Promise.all(unlockPromises);
  const newAchievements = unlockResults.flat();

  // Return exactly 1 star visual to represent the skip
  return { success: true, earnedXp: totalXpAwarded, stars: 1, newStreak, newAchievements };
}
