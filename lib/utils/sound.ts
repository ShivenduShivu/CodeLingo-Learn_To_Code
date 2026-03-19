"use client";

export function playCorrectSound() {
  if (typeof window !== "undefined") {
    const audio = new Audio("/sounds/correct.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }
}

export function playLevelUpSound() {
  if (typeof window !== "undefined") {
    const audio = new Audio("/sounds/levelup.mp3");
    audio.volume = 0.6;
    audio.play().catch(() => {});
  }
}

export function playClickSound() {
  if (typeof window !== "undefined") {
    const audio = new Audio("/sounds/click.mp3");
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }
}
