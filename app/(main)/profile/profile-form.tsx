"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface Props {
  initialUsername: string;
  initialAvatar: string;
  email: string;
}

export function ProfileForm({ initialUsername, initialAvatar, email }: Props) {
  const [username, setUsername] = useState(initialUsername);
  const [avatar, setAvatar] = useState(initialAvatar);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setMessage("");

    const formData = new FormData();
    formData.append("username", username);
    formData.append("avatar_url", avatar);

    const result = await updateProfile(formData);

    if (result.error) {
      setMessage(`❌ ${result.error}`);
    } else {
      setMessage("✅ Profile updated successfully!");
    }
    
    setIsPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto border border-white/20 hover:scale-[1.01] transition-transform duration-300">
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-28 h-28 rounded-full overflow-hidden bg-slate-100 ring-4 ring-green-400/40 shadow-[0_0_25px_rgba(34,197,94,0.4)] mb-3 hover:scale-105 transition-transform duration-200 shrink-0">
          <Image 
             src={avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=fallback"} 
             alt="Avatar" 
             fill 
             className="object-cover" 
             unoptimized // For dicebear dynamic SVGs
          />
        </div>
        <p className="text-2xl font-bold text-gray-900 mt-2">{username}</p>
        <p className="text-sm text-gray-500">{email}</p>
      </div>

      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-extrabold text-slate-700 uppercase tracking-widest">Username</label>
          <input 
            type="text" 
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none transition-all duration-200 ease-out font-medium text-slate-800"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-extrabold text-slate-700 uppercase tracking-widest">Avatar Selection</label>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {["coder", "bot", "rocket", "pixel", "dev", "neon"].map((seed) => {
              const seedUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
              const isSelected = avatar === seedUrl;
              return (
                <button
                  key={seed}
                  type="button"
                  onClick={() => setAvatar(seedUrl)}
                  className={`relative w-full aspect-square p-2 rounded-xl border hover:scale-110 hover:shadow-lg transition-all duration-200 ease-out cursor-pointer ${
                    isSelected ? "border-green-500 bg-green-50 scale-110 shadow-[0_0_15px_rgba(34,197,94,0.5)]" : "border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  <Image src={seedUrl} alt={seed} fill unoptimized className="object-cover rounded-lg p-1" />
                </button>
              );
            })}
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-sm font-bold border-2 ${message.startsWith("✅") ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}>
            {message}
          </div>
        )}

        <Button 
           type="submit" 
           disabled={isPending} 
           className="mt-6 w-full py-3 h-14 rounded-xl bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 ease-out"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
          Save Profile
        </Button>
      </div>
    </form>
  );
}
