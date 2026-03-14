export function calculateStreak(lastActivityDate: string | null, currentStreak: number = 0): number {
  if (!lastActivityDate) return 0;

  const lastActivity = new Date(lastActivityDate);
  const today = new Date();
  
  lastActivity.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastActivity.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return currentStreak + 1;
  } else if (diffDays === 0) {
    return currentStreak;
  } else {
    return 1;
  }
}
