import axios from "axios"

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

export interface Question {
    id?: number;
    content: string;
    options: string[];
    correctAnswer: string;
}

export interface Assessment {
    id: number;
    developerId: number;
    title: string;
    description: string;
    difficultyLevel: string;
    questionCount: number;
    isActive: boolean;
    questions: Question[];
}

export interface UserAssessment {
    id: number;
    userId: number;
    assessmentId: number;
    score: number;
    passed: boolean;
    completedAt: string;
}

export const createAssesment = async (assessmentData: Partial<Assessment>) => {
    const response = await axiosInstance.post('/assessments', assessmentData)
    return response.data
}

export const completeAssessment = async (assessmentId: number, answers: string[], userId: number) => {
    const response = await axiosInstance.post('/assessments/complete', {
        assessmentId,
        answers,
        userId,
    })
    return response.data
}

export const getUserAssessments = async () => {
    const response = await axiosInstance.get('/assessments/user')
    return response.data
}