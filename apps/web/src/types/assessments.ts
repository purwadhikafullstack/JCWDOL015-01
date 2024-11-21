export interface Question {
    content: string;
    options: string[];
    correctAnswer: string;
}

export interface SkillAssessment {
    id: number;
    title: string;
    description: string;
    difficultyLevel: string;
    questionCount: number;
    isActive: boolean;
    questions: Question[];
}

export interface UserAssessment {
    userId: number;
    assessmentId: number;
    score: number;
    passed: boolean;
    completedAt: string;
}

export interface SubmitAssessment {
    assessmentId: number;
    answers: string[];
    userId: number;
}
