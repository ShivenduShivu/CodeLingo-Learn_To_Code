"use server"

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "Unauthorized" };
  }

  const username = formData.get("username") as string;
  const avatar_url = formData.get("avatar_url") as string;

  if (!username || !avatar_url) {
    return { error: "Username and Avatar URL are required." };
  }

  // Update public.users
  const { error: dbError } = await supabase
    .from("users")
    .update({ username, avatar_url })
    .eq("id", user.id);

  if (dbError) {
    return { error: dbError.message };
  }

  // Optionally update auth user meta for future sessions
  await supabase.auth.updateUser({
    data: { username, avatar_url }
  });

  revalidatePath("/profile");
  revalidatePath("/leaderboard");

  return { success: true };
}
