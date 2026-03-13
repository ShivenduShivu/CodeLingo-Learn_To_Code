import { createClient } from "@/lib/supabase/server";

export type UnlockEvent = {
  achieved: boolean;
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    xp_reward: number;
  };
};

/**
 * Event-Driven architecture evaluator.
 * Prevents continuous database polling by receiving signals securely from Server Action progression handlers.
 * @param userId - Auth user performing the action
 * @param eventType - The action that just occurred (e.g. 'XP_GAINED')
 * @param eventValue - The current absolute volume / threshold of that event (e.g. 50 (total xp))
 * @returns Array of newly unlocked achievements to display in the UI.
 */
export async function checkAchievements(userId: string, eventType: string, eventValue: number): Promise<UnlockEvent[]> {
  const supabase = createClient();

  // 1. Fetch all locked achievements that match this event type
  const { data: globalAchievements, error: globalErr } = await supabase
    .from('achievements')
    .select('*')
    .eq('condition_type', eventType);

  if (globalErr || !globalAchievements) {
    console.error("Achievement fetch error", globalErr);
    return [];
  }

  // 2. Filter down to ones where passing thresholds are met
  const candidateAchievements = globalAchievements.filter(ach => eventValue >= ach.condition_value);
  if (candidateAchievements.length === 0) return [];

  // 3. Find which candidate achievements the user already unlocked to avoid redundantly querying 
  // (We use an IN query for scaling, but DB Unique constraints will also block hard collisions)
  const candidateIds = candidateAchievements.map(a => a.id);
  const { data: alreadyUnlocked, error: ulErr } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId)
    .in('achievement_id', candidateIds);

  if (ulErr) {
    console.error("Unlocked verify error", ulErr);
    return [];
  }

  const alreadyUnlockedIds = new Set(alreadyUnlocked?.map(u => u.achievement_id) || []);
  const newUnlocks = candidateAchievements.filter(ach => !alreadyUnlockedIds.has(ach.id));

  if (newUnlocks.length === 0) return [];

  const newlyGranted: UnlockEvent[] = [];

  // 4. Grant the unearned achievements
  // (This handles bulk inserts elegantly. The DB UNIQUE constraint provides the final strict race-condition backstop.)
  const inserts = newUnlocks.map(ach => ({
    user_id: userId,
    achievement_id: ach.id
  }));

  const { error: insertErr } = await supabase
    .from('user_achievements')
    .insert(inserts);

  if (insertErr) {
    console.error("Achievement grant error", insertErr);
    // Continue despite error because a constraint collision just means it was legitimately already unlocked.
    return [];
  }

  // 5. Push the rewards back out so standard progression UI can celebrate them
  for (const ach of newUnlocks) {
     newlyGranted.push({
       achieved: true,
       achievement: {
         id: ach.id,
         name: ach.name,
         description: ach.description,
         icon: ach.icon,
         xp_reward: ach.xp_reward
       }
     });

     // Optionally, recursively add the XP reward to the user's total.
     // In an advanced architecture, we'd emit ANOTHER event here for XP_GAINED!
     if (ach.xp_reward > 0) {
        // Find existing XP and add it.
        const { data: userProg } = await supabase
          .from('user_progress')
          .select('id, total_xp')
          .eq('user_id', userId)
          .limit(1)
          .single();

        if (userProg) {
           await supabase
             .from('user_progress')
             .update({ total_xp: (userProg.total_xp || 0) + ach.xp_reward })
             .eq('id', userProg.id);
        }
     }
  }

  return newlyGranted;
}
