export type User = {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  created_at: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  icon: string | null;
};

export type Track = {
  id: string;
  course_id: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
};

export type Level = {
  id: string;
  track_id: string;
  level_number: number;
  title: string;
  xp_reward: number;
};

export type Lesson = {
  id: string;
  level_id: string;
  type: 'concept' | 'exercise' | 'quiz';
};

export type Question = {
  id: string;
  lesson_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'code_completion';
  explanation?: string;
};

export type Answer = {
  id: string;
  question_id: string;
  answer_text: string;
  is_correct: boolean;
};

export type UserProgress = {
  id: string;
  user_id: string;
  level_id: string;
  stars: number;
  completion_percent: number;
};

export type XPLog = {
  id: string;
  user_id: string;
  xp_earned: number;
  reason: string;
  created_at: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type UserAchievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
};
