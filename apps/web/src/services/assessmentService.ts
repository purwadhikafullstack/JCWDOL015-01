// services/assessmentService.ts
import axiosInstance from '@/lib/axiosInstance';

// Fetch available assessments for the user
export const getUserAssessments = async (userId: number) => {
    const response = await axiosInstance.get(`/assessments/user`, {
        params: { userId },
    });
    return response.data;
};

// Fetch questions for a specific assessment
export const getAssessmentQuestions = async (assessmentId: number) => {
    const response = await axiosInstance.get(`/assessments/${assessmentId}`);
    return response.data.questions;
};

// Submit answers for an assessment
export const completeAssessment = async (assessmentId: number, answers: string[]) => {
    const response = await axiosInstance.post(`/assessments/complete`, {
        assessmentId,
        answers,
    });
    return response.data;
};

// Start a new assessment by fetching questions
export const startAssessment = async (assessmentId: number) => {
    const response = await axiosInstance.get(`/assessments/${assessmentId}`);
    return response.data;
};
