import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/app/(main)/profile/profile-form";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: dbUser } = await supabase
    .from("users")
    .select("username, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-1">Your Coding Identity</h1>
        <p className="text-sm text-white/70">Customize your avatar and let your code speak for you.</p>
      </div>

      <div className="w-full flex justify-center">
        <ProfileForm
          initialUsername={dbUser?.username || ""}
          initialAvatar={dbUser?.avatar_url || ""}
          email={user.email || ""}
        />
      </div>
    </div>
  );
}
