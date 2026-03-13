import { create } from 'zustand';

interface LessonState {
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  correctAnswers: number;
  lessonProgress: number;
  isChecking: boolean;
  isCorrect: boolean | null;
  hearts: number;
  
  // Actions
  selectAnswer: (answerId: string) => void;
  checkAnswer: (isCorrect: boolean) => void;
  nextQuestion: (totalQuestions: number) => void;
  decrementHeart: () => void;
  setHearts: (amount: number) => void;
  resetLesson: () => void;
}

export const useLessonStore = create<LessonState>((set) => ({
  currentQuestionIndex: 0,
  selectedAnswer: null,
  correctAnswers: 0,
  lessonProgress: 0,
  isChecking: false,
  isCorrect: null,
  hearts: 5,

  selectAnswer: (answerId) => set({ selectedAnswer: answerId }),
  
  checkAnswer: (isCorrect) => set((state) => ({ 
    isChecking: true, 
    isCorrect,
    correctAnswers: isCorrect ? state.correctAnswers + 1 : state.correctAnswers
  })),

  nextQuestion: (totalQuestions) => set((state) => {
    const nextIndex = state.currentQuestionIndex + 1;
    return {
      currentQuestionIndex: nextIndex,
      lessonProgress: (nextIndex / totalQuestions) * 100,
      selectedAnswer: null,
      isChecking: false,
      isCorrect: null
    };
  }),

  decrementHeart: () => set((state) => ({ hearts: Math.max(0, state.hearts - 1) })),
  
  setHearts: (amount) => set({ hearts: amount }),

  resetLesson: () => set({
    currentQuestionIndex: 0,
    selectedAnswer: null,
    correctAnswers: 0,
    lessonProgress: 0,
    isChecking: false,
    isCorrect: null,
    hearts: 5
  })
}));
