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
    (ml_intermediate_track_id, ml_course_id, 'Algorithms', 'Intermediate', 2),
    (ml_advanced_track_id, ml_course_id, 'Neural Networks', 'Advanced', 3);

    -- --------------------------------------------------------------------------------------
    -- PYTHON LEVELS (Variables, Loops, Functions, Conditions, Lists)
    -- --------------------------------------------------------------------------------------
    DECLARE
        p_lvl1_id UUID := gen_random_uuid();
        p_lvl2_id UUID := gen_random_uuid();
        p_lvl3_id UUID := gen_random_uuid();
        p_lvl4_id UUID := gen_random_uuid();
        p_lvl5_id UUID := gen_random_uuid();

        ml_lvl1_id UUID := gen_random_uuid();
        ml_lvl2_id UUID := gen_random_uuid();
        ml_lvl3_id UUID := gen_random_uuid();
        ml_lvl4_id UUID := gen_random_uuid();

        lesson_id UUID;
        q_id UUID;
    BEGIN
        INSERT INTO public.levels (id, track_id, level_number, title, xp_reward)
        VALUES
        (p_lvl1_id, python_beginner_track_id, 1, 'Variables', 10),
        (p_lvl2_id, python_beginner_track_id, 2, 'Conditions', 15),
        (p_lvl3_id, python_beginner_track_id, 3, 'Loops', 15),
        (p_lvl4_id, python_beginner_track_id, 4, 'Functions', 20),
        (p_lvl5_id, python_beginner_track_id, 5, 'Lists', 20);

        INSERT INTO public.levels (id, track_id, level_number, title, xp_reward)
        VALUES
        (ml_lvl1_id, ml_beginner_track_id, 1, 'What is ML?', 10),
        (ml_lvl2_id, ml_beginner_track_id, 2, 'Supervised vs Unsupervised', 10),
        (ml_lvl3_id, ml_beginner_track_id, 3, 'Data & Features', 15),
        (ml_lvl4_id, ml_beginner_track_id, 4, 'Simple Prediction', 20);

        -- PYTHON 1: VARIABLES
        lesson_id := gen_random_uuid();
        INSERT INTO public.lessons (id, level_id, title, lesson_type, lesson_order) VALUES (lesson_id, p_lvl1_id, 'Understanding Variables', 'quiz', 1);
        
        q_id := gen_random_uuid();
        INSERT INTO public.questions (id, lesson_id, question_type, question_text, explanation) VALUES (q_id, lesson_id, 'multiple_choice', 'What is a variable?', 'A container for storing data values.');
        INSERT INTO public.answers (question_id, answer_text, is_correct) VALUES 
          (q_id, 'A container for data', true), (q_id, 'A loop', false), (q_id, 'A class', false);
          
        q_id := gen_random_uuid();
        INSERT INTO public.questions (id, lesson_id, question_type, question_text, explanation) VALUES (q_id, lesson_id, 'multiple_choice', 'Which is valid in Python?', 'No let, var or const is needed directly in python definitions.');
        INSERT INTO public.answers (question_id, answer_text, is_correct) VALUES 
          (q_id, 'var x = 5', false), (q_id, 'x = 5', true), (q_id, 'let x = 5', false);

        -- PYTHON 2: CONDITIONS
        lesson_id := gen_random_uuid();
        INSERT INTO public.lessons (id, level_id, title, lesson_type, lesson_order) VALUES (lesson_id, p_lvl2_id, 'If Else logic', 'quiz', 1);
        
        q_id := gen_random_uuid();
        INSERT INTO public.questions (id, lesson_id, question_type, question_text, explanation) VALUES (q_id, lesson_id, 'multiple_choice', 'Which keyword checks an alternative condition?', 'elif is Python''s else if form.');
        INSERT INTO public.answers (question_id, answer_text, is_correct) VALUES 
          (q_id, 'else if', false), (q_id, 'elseif', false), (q_id, 'elif', true);

        -- PYTHON 3: LOOPS
        lesson_id := gen_random_uuid();
        INSERT INTO public.lessons (id, level_id, title, lesson_type, lesson_order) VALUES (lesson_id, p_lvl3_id, 'For & While Loops', 'quiz', 1);
        
        q_id := gen_random_uuid();
        INSERT INTO public.questions (id, lesson_id, question_type, question_text, explanation) VALUES (q_id, lesson_id, 'multiple_choice', 'How to write a standard loop iterating 5 times?', 'range(5) outputs indices 0 to 4.');
        INSERT INTO public.answers (question_id, answer_text, is_correct) VALUES 
          (q_id, 'for i = 1 to 5:', false), (q_id, 'for i in range(5):', true), (q_id, 'loop 5 times:', false);

        -- PYTHON 4: FUNCTIONS
        lesson_id := gen_random_uuid();
        INSERT INTO public.lessons (id, level_id, title, lesson_type, lesson_order) VALUES (lesson_id, p_lvl4_id, 'Def Blocks', 'code', 1);
        
        q_id := gen_random_uuid();
        INSERT INTO public.questions (id, lesson_id, question_type, question_text, explanation) VALUES (q_id, lesson_id, 'code', 'Define a function called hello that prints "Hello" and call it.', 'Use the def keyword.');
        INSERT INTO public.answers (question_id, answer_text, is_correct) VALUES 
          (q_id, 'Hello\n', true);

        -- PYTHON 5: LISTS
        lesson_id := gen_random_uuid();
        INSERT INTO public.lessons (id, level_id, title, lesson_type, lesson_order) VALUES (lesson_id, p_lvl5_id, 'List Logic', 'quiz', 1);
        
        q_id := gen_random_uuid();
        INSERT INTO public.questions (id, lesson_id, question_type, question_text, explanation) VALUES (q_id, lesson_id, 'multiple_choice', 'How do you create an array/list in Python?', 'Square Brackets are standard list constructors.');
        INSERT INTO public.answers (question_id, answer_text, is_correct) VALUES 
          (q_id, 'myList = ()', false), (q_id, 'myList = []', true), (q_id, 'myList = {}', false);

        -- ML 1: WHAT IS ML
        lesson_id := gen_random_uuid();
        INSERT INTO public.lessons (id, level_id, title, lesson_type, lesson_order) VALUES (lesson_id, ml_lvl1_id, 'Definition of Machine Learning', 'quiz', 1);
        
        q_id := gen_random_uuid();
        INSERT INTO public.questions (id, lesson_id, question_type, question_text, explanation) VALUES (q_id, lesson_id, 'multiple_choice', 'What is Machine Learning fundamentally?', 'Algorithms learning from data patterns rather than strict rules.');
        INSERT INTO public.answers (question_id, answer_text, is_correct) VALUES 
          (q_id, 'Writing strict if-else rules', false), (q_id, 'Algorithms learning from data patterns', true);

        -- ML 2: SUPERVISED VS UNSUPERVISED
        lesson_id := gen_random_uuid();
        INSERT INTO public.lessons (id, level_id, title, lesson_type, lesson_order) VALUES (lesson_id, ml_lvl2_id, 'Types of Learning', 'quiz', 1);
        
        q_id := gen_random_uuid();
        INSERT INTO public.questions (id, lesson_id, question_type, question_text, explanation) VALUES (q_id, lesson_id, 'multiple_choice', 'What makes learning Supervised?', 'When data is labeled and targets are provided.');
        INSERT INTO public.answers (question_id, answer_text, is_correct) VALUES 
          (q_id, 'Providing data with labeled targets', true), (q_id, 'The model groups data on its own', false);

        -- ML 3: DATA & FEATURES
        lesson_id := gen_random_uuid();
        INSERT INTO public.lessons (id, level_id, title, lesson_type, lesson_order) VALUES (lesson_id, ml_lvl3_id, 'Preparing Data', 'quiz', 1);
        
        q_id := gen_random_uuid();
        INSERT INTO public.questions (id, lesson_id, question_type, question_text, explanation) VALUES (q_id, lesson_id, 'multiple_choice', 'What is a feature?', 'Features are measurable properties or characteristics used as inputs.');
        INSERT INTO public.answers (question_id, answer_text, is_correct) VALUES 
          (q_id, 'The final prediction', false), (q_id, 'An input variable used for prediction', true);

        -- ML 4: SIMPLE PREDICTION
        lesson_id := gen_random_uuid();
        INSERT INTO public.lessons (id, level_id, title, lesson_type, lesson_order) VALUES (lesson_id, ml_lvl4_id, 'Making Inferences', 'quiz', 1);
        
        q_id := gen_random_uuid();
        INSERT INTO public.questions (id, lesson_id, question_type, question_text, explanation) VALUES (q_id, lesson_id, 'multiple_choice', 'What is Inference?', 'Using a trained model to make predictions on new data.');
        INSERT INTO public.answers (question_id, answer_text, is_correct) VALUES 
          (q_id, 'Training the model', false), (q_id, 'Making predictions on unseen data', true);

    END;
END $$;
