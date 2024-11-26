export interface Question {
    content: string;
    options: string[];
    correctAnswer?: string;
}

export interface Assessment {
    id: number;
    title: string;
    description: string;
    difficultyLevel: string;
    developerId: number;
    questions: Question[];
}

export interface CompleteAssessmentPayload {
    assessmentId: number;
    answers: string[];
}

export interface CreateAssessmentPayload {
    title: string;
    description: string;
    difficultyLevel: string;
    developerId: number;
    questions: Question[];
}

export interface AssessmentResult {
    message: string;
    score: number;
    passed: boolean;
}
