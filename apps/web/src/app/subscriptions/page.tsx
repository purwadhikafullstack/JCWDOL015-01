'use client';

import React, { useEffect, useState } from 'react';
import { getAllSubscriptionCategories, purchaseSubscription, getUserSubscriptions } from '@/services/subsServices';
import SubscriptionCard from '@/components/Subscriptions/subsCards';
import UserSubs from '@/components/Subscriptions/userSubs';
import { SubscriptionCategory, UserSubscription } from '@/types/subscriptions';

const SubscriptionPage: React.FC = () => {
    const [categories, setCategories] = useState<SubscriptionCategory[]>([]);
    const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
    const userId = 1; // Replace with actual userId logic

    useEffect(() => {
        async function fetchData() {
            const subsCategories = await getAllSubscriptionCategories();
            setCategories(subsCategories);

            const user = await getUserSubscriptions(userId);
            if (user?.subscriptions?.length) {
                setUserSubscription(user.subscriptions[0]); // Assuming the first is active
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
        <div className="subscription-page">
            {userSubscription ? (
                <UserSubs subscription={userSubscription} />
            ) : (
                <p>No active subscription. Please choose one below.</p>
            )}
            <div className="subscription-cards">
                {categories.map((category, index) => (
                    <SubscriptionCard key={index} category={category} onPurchase={handlePurchase} />
                ))}
            </div>
        </div>
    );
};

export default SubscriptionPage;
