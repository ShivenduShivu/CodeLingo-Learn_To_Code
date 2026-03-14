"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function enroll(courseId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // 1. Fetch the primary (first) track of the course to initialize progress correctly
  const { data: track, error: trackError } = await supabase
    .from("tracks")
    .select("id")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true })
    .limit(1)
    .single();

  if (trackError || !track) {
    return { error: "Failed to locate starting track for this course." };
  }

  // 2. Insert into user_progress (Our schema has UNIQUE(user_id, course_id, track_id) so duplicates crash safely, preventing double-enroll)
  const { error: insertError } = await supabase
    .from("user_progress")
    .insert({
       user_id: user.id,
       course_id: courseId,
       track_id: track.id,
       current_level: 1,
       hearts_remaining: 5,
       total_xp: 0
    });

  if (insertError) {
    // If it's a unique constraint violation, they are already enrolled anyway, so just silently redirect.
    if (insertError.code === '23505') {
       redirect("/dashboard");
    }
    return { error: insertError.message };
  }

  // 3. Redirect back to dashboard to start playing
  redirect("/dashboard");
}
