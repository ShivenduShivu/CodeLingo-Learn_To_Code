-- Clean existing data to avoid conflicts on re-seeds
TRUNCATE public.courses CASCADE;

DO $$ 
DECLARE
    python_course_id UUID := gen_random_uuid();
    ml_course_id UUID := gen_random_uuid();
    
    python_beginner_track_id UUID := gen_random_uuid();
    python_intermediate_track_id UUID := gen_random_uuid();
    python_advanced_track_id UUID := gen_random_uuid();
    
    ml_beginner_track_id UUID := gen_random_uuid();
    ml_intermediate_track_id UUID := gen_random_uuid();
    ml_advanced_track_id UUID := gen_random_uuid();
BEGIN
    -- Seed Courses
    INSERT INTO public.courses (id, title, description, image_url, color_hex, slug)
    VALUES 
    (python_course_id, 'Python', 'Learn the basics of Python programming, syntax, and logic.', '/images/courses/python.svg', '#FFD43B', 'python'),
    (ml_course_id, 'Machine Learning', 'Master ML algorithms, data processing, and AI models.', '/images/courses/ml.svg', '#58CC02', 'machine-learning');

    -- Seed Python Tracks
    INSERT INTO public.tracks (id, course_id, title, difficulty_level, order_index)
    VALUES
    (python_beginner_track_id, python_course_id, 'Python Basics', 'Beginner', 1),
    (python_intermediate_track_id, python_course_id, 'Data Structures', 'Intermediate', 2),
    (python_advanced_track_id, python_course_id, 'Object-Oriented Programming', 'Advanced', 3);

    -- Seed Machine Learning Tracks
    INSERT INTO public.tracks (id, course_id, title, difficulty_level, order_index)
    VALUES
    (ml_beginner_track_id, ml_course_id, 'Data Fundamentals', 'Beginner', 1),
    (ml_intermediate_track_id, ml_course_id, 'Supervised Learning', 'Intermediate', 2),
    (ml_advanced_track_id, ml_course_id, 'Neural Networks', 'Advanced', 3);

    -- Seed Python Levels (Beginner)
    INSERT INTO public.levels (track_id, level_number, title, xp_reward)
    VALUES
    (python_beginner_track_id, 1, 'Print & Strings', 10),
    (python_beginner_track_id, 2, 'Variables', 10),
    (python_beginner_track_id, 3, 'Math Operations', 15),
    (python_beginner_track_id, 4, 'If/Else Logic', 20),
    (python_beginner_track_id, 5, 'Basic Loops', 20);

    -- Seed Machine Learning Levels (Beginner)
    INSERT INTO public.levels (track_id, level_number, title, xp_reward)
    VALUES
    (ml_beginner_track_id, 1, 'What is ML?', 10),
    (ml_beginner_track_id, 2, 'Types of Learning', 10),
    (ml_beginner_track_id, 3, 'Data Cleaning', 15),
    (ml_beginner_track_id, 4, 'Features & Labels', 20),
    (ml_beginner_track_id, 5, 'Training Sets', 20);

END $$;
