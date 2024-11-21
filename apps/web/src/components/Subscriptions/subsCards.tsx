import React from 'react';
import { SubscriptionCategory } from '@/types/subscriptions';

interface Props {
    category: SubscriptionCategory;
    onPurchase: (type: string) => void;
}

const SubscriptionCard: React.FC<Props> = ({ category, onPurchase }) => {
    return (
        <div className="card">
            <h3>{category.type}</h3>
            <p>Cost: {category.cost.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
            <ul>
                {category.features.map((feature: any, index: any) => (
                    <li key={index}>{feature}</li>
                ))}
            </ul>
            <button onClick={() => onPurchase(category.type)}>Subscribe</button>
        </div>
    );
};

export default SubscriptionCard;
