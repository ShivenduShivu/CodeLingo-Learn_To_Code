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
    -- We need to capture the exact UUID of Level 1 so we can attach a lesson to it!
    DECLARE
        python_lvl1_id UUID := gen_random_uuid();
        lesson_id UUID := gen_random_uuid();
        q1_id UUID := gen_random_uuid();
        q2_id UUID := gen_random_uuid();
        q3_id UUID := gen_random_uuid();
    BEGIN
        INSERT INTO public.levels (id, track_id, level_number, title, xp_reward)
        VALUES
        (python_lvl1_id, python_beginner_track_id, 1, 'Print & Strings', 10),
        (gen_random_uuid(), python_beginner_track_id, 2, 'Variables', 10),
        (gen_random_uuid(), python_beginner_track_id, 3, 'Math Operations', 15),
        (gen_random_uuid(), python_beginner_track_id, 4, 'If/Else Logic', 20),
        (gen_random_uuid(), python_beginner_track_id, 5, 'Basic Loops', 20);

        -- Seed Machine Learning Levels (Beginner)
        INSERT INTO public.levels (track_id, level_number, title, xp_reward)
        VALUES
        (ml_beginner_track_id, 1, 'What is ML?', 10),
        (ml_beginner_track_id, 2, 'Types of Learning', 10),
        (ml_beginner_track_id, 3, 'Data Cleaning', 15),
        (ml_beginner_track_id, 4, 'Features & Labels', 20),
        (ml_beginner_track_id, 5, 'Training Sets', 20);

        -- ---------------------------------------------------------
        -- SEED NESTED LESSON DATA FOR PYTHON LEVEL 1
        -- ---------------------------------------------------------
        INSERT INTO public.lessons (id, level_id, title, lesson_type, lesson_order)
        VALUES (lesson_id, python_lvl1_id, 'Introduction to Python Strings', 'quiz', 1);

        -- Insert 3 Questions for the lesson
        INSERT INTO public.questions (id, lesson_id, question_type, question_text, explanation)
        VALUES
        (q1_id, lesson_id, 'multiple_choice', 'How do you print "Hello World" in Python?', 'The print() function is used to output text to the console.'),
        (q2_id, lesson_id, 'multiple_choice', 'Which character is used to create a comment?', 'The # symbol marks the start of a single-line comment in Python.'),
        (q3_id, lesson_id, 'multiple_choice', 'Which of these is a valid variable name?', 'Variable names cannot start with a number or be a reserved keyword (like class). They also cannot contain spaces.');

        -- Insert Answers for Question 1
        INSERT INTO public.answers (question_id, answer_text, is_correct) VALUES
        (q1_id, 'echo "Hello World"', false),
        (q1_id, 'console.log("Hello World")', false),
        (q1_id, 'print("Hello World")', true),
        (q1_id, 'printf("Hello World")', false);

        -- Insert Answers for Question 2
        INSERT INTO public.answers (question_id, answer_text, is_correct) VALUES
        (q2_id, '//', false),
        (q2_id, '/* */', false),
        (q2_id, '<!-- -->', false),
        (q2_id, '#', true);

        -- Insert Answers for Question 3
        INSERT INTO public.answers (question_id, answer_text, is_correct) VALUES
        (q3_id, '1st_variable', false),
        (q3_id, 'my variable', false),
        (q3_id, 'my_variable_1', true),
        (q3_id, 'class', false);

    END;
END $$;
