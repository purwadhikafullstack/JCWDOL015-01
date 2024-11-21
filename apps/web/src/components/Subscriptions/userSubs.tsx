import React from 'react';
import { UserSubscription } from '@/types/subscriptions';

interface Props {
    subscription: UserSubscription;
}

const UserSubs: React.FC<Props> = ({ subscription }) => {
    return (
        <div className="subscription-details">
            <h3>Active Subscription</h3>
            <p>Type: {subscription.type}</p>
            <p>Start Date: {new Date(subscription.startDate).toLocaleDateString()}</p>
            <p>End Date: {new Date(subscription.endDate).toLocaleDateString()}</p>
            <p>Status: {subscription.status}</p>
        </div>
    );
};

export default UserSubs;
