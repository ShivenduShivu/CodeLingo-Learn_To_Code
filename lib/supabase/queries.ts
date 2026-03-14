import { createClient } from './server'

export type Course = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  color_hex: string;
  slug: string;
  created_at: string;
};

export type Track = {
  id: string;
  course_id: string;
  title: string;
  difficulty_level: string;
  order_index: number;
  created_at: string;
};

export type Level = {
  id: string;
  track_id: string;
  level_number: number;
  title: string;
  xp_reward: number;
  created_at: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  course_id: string;
  track_id: string;
  current_level: number;
  hearts_remaining: number;
  total_xp: number;
  last_activity: string | null;
};

export async function getCourses(): Promise<Course[]> {
  const supabase = createClient();
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .order('title');

  if (error) {
    console.error("Error fetching courses:", error.message);
    return [];
  }
  return courses || [];
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const supabase = createClient();
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error("Error fetching course by slug:", error.message);
    return null;
  }
  return course;
}

export async function getEnrolledCourseIds(userId: string): Promise<string[]> {
  const supabase = createClient();
  // Fetch distinct course_ids from user_progress
  const { data, error } = await supabase
    .from('user_progress')
    .select('course_id')
    .eq('user_id', userId);

  if (error) {
    console.error("Error fetching enrolled course IDs:", error.message);
    return [];
  }
  
  // Create unique set array of IDs
  return Array.from(new Set(data.map(p => p.course_id)));
}

export async function getEnrolledCourses(userId: string): Promise<Course[]> {
  const supabase = createClient();
  // Join the courses table through the user_progress table
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*, user_progress!inner(user_id)')
    .eq('user_progress.user_id', userId)
    .order('title');

  if (error) {
    console.error("Error fetching enrolled courses:", error.message);
    return [];
  }
  return courses || [];
}

export async function getTracks(courseId: string): Promise<Track[]> {
  const supabase = createClient();
  const { data: tracks, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index');

  if (error) {
    console.error("Error fetching tracks:", error.message);
    return [];
  }
  return tracks || [];
}

export async function getUserProgress(userId: string, courseId: string): Promise<UserProgress | null> {
  const supabase = createClient();
  const { data: progress, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching user progress:", error.message);
    return null;
  }
  return progress;
}

export async function getLevels(trackId: string): Promise<Level[]> {
  const supabase = createClient();
  const { data: levels, error } = await supabase
    .from('levels')
    .select('*')
    .eq('track_id', trackId)
    .order('level_number', { ascending: true });

  if (error) {
    console.error("Error fetching levels:", error.message);
    return [];
  }
  return levels || [];
}

export type Lesson = {
  id: string;
  level_id: string;
  title: string;
  lesson_type: string;
  lesson_order: number;
  created_at: string;
};

export type Question = {
  id: string;
  lesson_id: string;
  question_type: string;
  question_text: string;
  explanation: string | null;
  created_at: string;
};

export type Answer = {
  id: string;
  question_id: string;
  answer_text: string;
  is_correct: boolean;
};

export async function getLessons(levelId: string): Promise<Lesson[]> {
  const supabase = createClient();
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('level_id', levelId)
    .order('lesson_order', { ascending: true });

  if (error) {
    console.error("Error fetching lessons:", error.message);
    return [];
  }
  return lessons || [];
}

export async function getQuestions(lessonId: string): Promise<Question[]> {
  const supabase = createClient();
  const { data: questions, error } = await supabase
    .from('questions')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('created_at', { ascending: true }); // Can add custom order field later if needed

  if (error) {
    console.error("Error fetching questions:", error.message);
    return [];
  }
  return questions || [];
}

export async function getAnswers(questionId: string): Promise<Answer[]> {
  const supabase = createClient();
  const { data: answers, error } = await supabase
    .from('answers')
    .select('*')
    .eq('question_id', questionId);

  if (error) {
    console.error("Error fetching answers:", error.message);
    return [];
  }
  return answers || [];
}

export type UserLeaderboard = {
  id: string;
  username: string;
  avatar_url: string;
  total_xp: number;
};

export async function getLeaderboard(limit = 50, offset = 0): Promise<UserLeaderboard[]> {
  const supabase = createClient();
  const { data: users, error } = await supabase
    .from('users')
    .select('id, username, avatar_url, total_xp')
    .order('total_xp', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching leaderboard:", error.message);
    return [];
  }
  return users || [];
}

export type CourseProgressSummary = {
  course_id: string;
  total_xp: number;
  track_title: string;
  completed_levels: number;
  total_levels: number;
};

export async function getCourseProgressMap(userId: string): Promise<Record<string, CourseProgressSummary>> {
  const supabase = createClient();
  const map: Record<string, CourseProgressSummary> = {};
  
  // 1. Get user_progress for all courses
  const { data: progresses, error } = await supabase
    .from('user_progress')
    .select('course_id, track_id, total_xp, tracks:track_id(title)')
    .eq('user_id', userId);
    
  if (error || !progresses) return map;

  // 2. Fetch completed details per active track
  await Promise.all(progresses.map(async (p) => {
    if (!p.track_id) return;
    
    // get total levels in track
    const { count: totalLevels } = await supabase
      .from('levels')
      .select('id', { count: 'exact', head: true })
      .eq('track_id', p.track_id);
      
    // get levels in this track that user has completed
    const { data: trackLevels } = await supabase
      .from('levels')
      .select('id')
      .eq('track_id', p.track_id);
      
    let completedLevels = 0;
    if (trackLevels && trackLevels.length > 0) {
      const levelIds = trackLevels.map(l => l.id);
      const { count: completedCount } = await supabase
        .from('level_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .in('level_id', levelIds);
        
      completedLevels = completedCount || 0;
    }

    // @ts-expect-error Typescript might complain about the joined title format
    const trackTitle = p.tracks?.title || "Active Track";

    map[p.course_id] = {
      course_id: p.course_id,
      total_xp: p.total_xp || 0,
      track_title: trackTitle,
      completed_levels: completedLevels,
      total_levels: totalLevels || 0
    };
  }));

  return map;
}
