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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-4 border-slate-200 shadow-sm shrink-0">
          <Image 
             src={avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=fallback"} 
             alt="Avatar" 
             fill 
             className="object-cover" 
             unoptimized // For dicebear dynamic SVGs
          />
        </div>
        <div className="space-y-1">
          <p className="font-bold text-slate-900">Current Avatar</p>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">Choose an avatar from the options below to represent your profile.</p>
        </div>
      </div>

      <div className="space-y-2 mt-8">
        <label className="text-sm font-extrabold text-slate-700 uppercase tracking-widest">Email Address</label>
        <input 
          type="email" 
          value={email}
          disabled
          className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-500 font-medium cursor-not-allowed"
        />
        <p className="text-xs text-slate-400 font-medium">Your account email cannot be changed.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-extrabold text-slate-700 uppercase tracking-widest">Username</label>
        <input 
          type="text" 
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 outline-none transition-all font-medium text-slate-800"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-extrabold text-slate-700 uppercase tracking-widest">Avatar Selection</label>
        <div className="grid grid-cols-3 gap-4">
          {["coder", "bot", "rocket", "pixel", "dev", "neon"].map((seed) => {
            const seedUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
            const isSelected = avatar === seedUrl;
            return (
              <button
                key={seed}
                type="button"
                onClick={() => setAvatar(seedUrl)}
                className={`relative w-full aspect-square rounded-2xl overflow-hidden border-4 transition-all ${
                  isSelected ? "border-indigo-500 shadow-lg scale-105" : "border-slate-200 hover:border-indigo-300"
                }`}
              >
                <Image src={seedUrl} alt={seed} fill unoptimized className="object-cover bg-slate-50" />
              </button>
            );
          })}
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-sm font-bold border-2 ${message.startsWith("✅") ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}>
          {message}
        </div>
      )}

      <Button 
         type="submit" 
         disabled={isPending} 
         className="w-full rounded-2xl h-14 text-lg font-bold bg-indigo-500 hover:bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 active:scale-95 transition-all mt-8"
      >
        {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
        Save Profile Optimization
      </Button>
    </form>
  );
}
