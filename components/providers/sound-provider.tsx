"use client";

/**
 * Sound provider: unlocks the audio context on the first user click, as
 * browsers require.
 */

import { useEffect } from "react";
import { initSound } from "@/lib/utils/sound";

export function SoundProvider() {
  useEffect(() => {
    const init = () => {
      initSound();
      window.removeEventListener("click", init);
    };

    window.addEventListener("click", init);
    
    // Cleanup in case component unmounts before click
    return () => window.removeEventListener("click", init);
  }, []);

  return null;
}
