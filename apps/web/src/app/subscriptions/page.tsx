'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/subscriptions/subs.module.css';
import { getAllSubscriptionCategories, purchaseSubscription, getUserSubscriptions } from '@/services/subsServices';
import SubscriptionCard from '@/components/Subscriptions/subsCards';
import UserSubs from '@/components/Subscriptions/userSubs';
import { SubscriptionCategory, UserSubscription } from '@/types/subscriptions';

const SubscriptionPage: React.FC = () => {
    const [categories, setCategories] = useState<SubscriptionCategory[]>([]);
    const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
    const userId = 1;

    useEffect(() => {
        async function fetchData() {
            const subsCategories = await getAllSubscriptionCategories();
            setCategories(subsCategories);

            const user = await getUserSubscriptions(userId);
            if (user?.subscriptions?.length) {
                setUserSubscription(user.subscriptions[0]);
            }
        }

        fetchData();
    }, [userId]);

    const handlePurchase = async (type: string) => {
        try {
            const paymentMethod = 'ONLINE'; // Mocking payment method
            await purchaseSubscription(userId, type, paymentMethod);
            alert('Subscription purchased successfully!');
            window.location.reload(); // Refresh to update active subscription
        } catch (error) {
            console.error('Error purchasing subscription:', error);
            alert('Failed to purchase subscription.');
        }
    };

    return (
        <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
            {userSubscription ? (
                <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
                    <UserSubs subscription={userSubscription} />
                </div>
            ) : (
                <p className="text-lg text-gray-700 mb-8 text-center">
                    No active subscription. Please choose one below.
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                    <SubscriptionCard
                        key={index}
                        category={category}
                        onPurchase={handlePurchase}
                    />
                ))}
            </div>
        </div>

    );
};

export default SubscriptionPage;
