"use client";

let isInitialized = false;

export function initSound() {
  if (isInitialized) return;
  isInitialized = true;
}

function play(src: string) {
  if (!isInitialized) return;

  try {
    const audio = new Audio(src);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch {}
}

export function playClickSound() {
  play("/sounds/click.mp3");
}

export function playCorrectSound() {
  play("/sounds/correct.mp3");
}

export function playLevelUpSound() {
  play("/sounds/levelup.mp3");
}
