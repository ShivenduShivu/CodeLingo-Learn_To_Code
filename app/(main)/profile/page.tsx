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
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Your Profile</h1>
        <p className="text-muted-foreground text-lg mt-2">Manage your public information and avatar.</p>
      </div>

      <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-sm">
        <ProfileForm
          initialUsername={dbUser?.username || ""}
          initialAvatar={dbUser?.avatar_url || ""}
          email={user.email || ""}
        />
      </div>
    </div>
  );
}
