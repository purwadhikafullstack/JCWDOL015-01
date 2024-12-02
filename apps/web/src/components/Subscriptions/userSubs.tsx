import React from 'react';
import { UserSubscription } from '@/types/subscriptions';

interface Props {
    subscription: UserSubscription;
}

const UserSubs: React.FC<Props> = ({ subscription }) => {
    return (
        <div className="max-w-xl mx-auto p-4">
            <h3 className="text-xl font-bold mb-4">Active Subscription</h3>
            <table className="table-auto w-full border border-gray-200 rounded-lg">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="px-4 py-2 text-sm font-medium text-gray-600">Detail</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-600">Information</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border-t px-4 py-2 text-gray-700">Type</td>
                        <td className="border-t px-4 py-2 text-gray-700">{subscription.type}</td>
                    </tr>
                    <tr className="bg-gray-50">
                        <td className="border-t px-4 py-2 text-gray-700">Start Date</td>
                        <td className="border-t px-4 py-2 text-gray-700">
                            {new Date(subscription.startDate).toLocaleDateString()}
                        </td>
                    </tr>
                    <tr>
                        <td className="border-t px-4 py-2 text-gray-700">End Date</td>
                        <td className="border-t px-4 py-2 text-gray-700">
                            {new Date(subscription.endDate).toLocaleDateString()}
                        </td>
                    </tr>
                    <tr className="bg-gray-50">
                        <td className="border-t px-4 py-2 text-gray-700">Status</td>
                        <td className="border-t px-4 py-2 text-gray-700">{subscription.status}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default UserSubs;
