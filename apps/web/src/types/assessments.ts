export interface Question {
    content: string;
    options: string[];
    correctAnswer?: string; // Include only if necessary for the developer
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
    userId: number;
}

export interface AssessmentResult {
    message: string;
    score: number;
    passed: boolean;
}
