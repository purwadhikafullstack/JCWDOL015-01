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


export async function fetchPendingSubscriptions() {
    const response = await axiosInstance.get(`/subscriptions/pending`, {
        headers: {
            'x-developer-id': 1
        }
    })
    return response.data;
}

export async function approveSubscription(dataApprove: {
    id: number;
    userId: number;
    subscriptionType: string;
    developerId: number;
}) {
    try {
        const response = await axiosInstance.put('/subscriptions/approve', dataApprove, {
            headers: {
                'x-developer-id': dataApprove.developerId
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error approving subscription");
    }
}
