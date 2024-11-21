export interface SubscriptionCategory {
    type: string;
    cost: number;
    features: string[];
    durationInDays: number;
}

export interface UserSubscription {
    id: number;
    type: string;
    startDate: string;
    endDate: string;
    status: string;
    payments: Payment[];
}

export interface Payment {
    id: number;
    amount: number;
    paymentMethod: "MANUAL" | "GATEWAY";
    paymentDate: Date;
    status: string;
}

export interface User {
    id: number;
    email: string;
    name?: string;
    subscriptionType?: string;
    subscriptionEndDate?: string;
    subscriptions?: UserSubscription[];
}
