import React from 'react';
import { SubscriptionCategory } from '@/types/subscriptions';

interface Props {
    category: SubscriptionCategory;
    onPurchase: (type: string) => void;
}

const SubscriptionCard: React.FC<Props> = ({ category, onPurchase }) => {
    return (
        <div className="card p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            {/* Subscription Type */}
            <h3 className="text-xl font-bold text-blue-600 mb-4">{category.type}</h3>

            {/* Subscription Cost */}
            <p className="text-lg text-gray-700 mb-4">
                Cost: {category.cost.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
            </p>

            {/* Features List */}
            <ul className="mb-6 space-y-2 text-gray-600">
                {category.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center">
                        <svg
                            className="w-5 h-5 text-green-500 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                    </li>
                ))}
            </ul>

            {/* Subscribe Button */}
            <button
                onClick={() => onPurchase(category.type)}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition duration-200"
            >
                Subscribe
            </button>
        </div>

    );
};

export default SubscriptionCard;
