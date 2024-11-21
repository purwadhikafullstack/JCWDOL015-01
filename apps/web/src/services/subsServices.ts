import axiosInstance from '@/lib/axiosInstance';
import { SubscriptionCategory, User } from '@/types/subscriptions';

export const getAllSubscriptionCategories = async (): Promise<SubscriptionCategory[]> => {
    const response = await axiosInstance.get('/subscriptions');
    return response.data;
};

export const purchaseSubscription = async (
    userId: number,
    type: string,
    paymentMethod: string
): Promise<any> => {
    const response = await axiosInstance.post('/subscriptions/purchase', {
        userId,
        type,
        paymentMethod,
    });
    return response.data;
};

export const getUserSubscriptions = async (userId: number): Promise<User> => {
    const response = await axiosInstance.get(`/subscriptions/user/${userId}`);
    return response.data;
};


export async function fetchPendingSubscriptions(developerId: number) {
    const response = await axiosInstance.get(`/subscriptions/pending/${developerId}`);
    return response.data;
}

export async function approveSubscription(data: {
    id: number;
    userId: number;
    subscriptionType: string;
    developerId: number;
}) {
    try {
        const response = await axiosInstance.put(`/subscriptions/approve/${data.developerId}`, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error approving subscription");
    }
}
