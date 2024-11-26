import axiosInstance from '@/lib/axiosInstance';
import { CompleteAssessmentPayload, CreateAssessmentPayload } from "@/types/assessments";

export const fetchUserAssessments = async (userId: number) => {
    try {
        const response = await axiosInstance.get(`/assessments/user/${userId}`);
        const subsResponse = await axiosInstance.get(`/subscriptions/user/${userId}`)
        return { Assessments: response.data, Subs: subsResponse.data }
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
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw error.response.data
        }
        console.error('Error completing assessment:', error)
        throw error
    }
};


export const createAssessment = async (assessmentData: CreateAssessmentPayload): Promise<any> => {
    const response = await axiosInstance.post('/assessments', assessmentData);
    return response.data;
};