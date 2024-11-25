import axiosInstance from '@/lib/axiosInstance';
import { Assessment, CompleteAssessmentPayload } from "@/types/assessments";

export const fetchUserAssessments = async (userId: number) => {
    try {
        const response = await axiosInstance.get(`/assessments/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching assessments:', error);
        throw error;
    }
};

export const completeAssessment = async (userId: number, payload: CompleteAssessmentPayload) => {
    try {
        const response = await axiosInstance.post('/assessments/complete', {
            ...payload,
            userId,
        });
        return response.data;
    } catch (error) {
        console.error('Error completing assessment:', error);
        throw error;
    }
};

export const createAssessment = async (assessmentData: Assessment): Promise<any> => {
    const response = await axiosInstance.post('/assessments', assessmentData)
    return response.data
}