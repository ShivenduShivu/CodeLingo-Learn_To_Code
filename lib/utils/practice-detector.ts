// Utility to track weak lessons in localStorage

const STORAGE_KEY = "codelingo-weak-lessons";
const WEAK_THRESHOLD = 3;

export interface LessonAttemptTracker {
    lessonId: string;
    attempts: number;
    lessonTitle?: string; // Cache the title to display in practice card
}

export function getPracticeData(): Record<string, LessonAttemptTracker> {
    if (typeof window === "undefined") return {};
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn("Failed to parse weak lessons", e);
    }
    return {};
}

function savePracticeData(data: Record<string, LessonAttemptTracker>) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn("Failed to stringify weak lessons", e);
    }
}

export function recordIncorrectAttempt(lessonId: string, lessonTitle?: string) {
    const data = getPracticeData();
    if (!data[lessonId]) {
        data[lessonId] = { lessonId, attempts: 0, lessonTitle };
    }
    // Only update title if not set
    if (!data[lessonId].lessonTitle && lessonTitle) {
         data[lessonId].lessonTitle = lessonTitle;
    }
    data[lessonId].attempts += 1;
    savePracticeData(data);
}

export function getWeakLessons(): LessonAttemptTracker[] {
    const data = getPracticeData();
    return Object.values(data).filter(item => item.attempts >= WEAK_THRESHOLD);
}

export function isLessonWeak(lessonId: string): boolean {
    const data = getPracticeData();
    return data[lessonId] !== undefined && data[lessonId].attempts >= WEAK_THRESHOLD;
}

export function clearWeakLesson(lessonId: string) {
    const data = getPracticeData();
    if (data[lessonId]) {
        delete data[lessonId];
        savePracticeData(data);
    }
}
