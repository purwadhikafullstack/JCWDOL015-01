"use client";

import React, { useEffect, useState } from "react";
import { fetchPendingSubscriptions, approveSubscription } from "@/services/subsServices";
import { Payment, UserSubscription } from "@/types/subscriptions";
import { FormatCurrency } from "@/lib/currency";

const DeveloperDashboard = () => {
    const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getPending = async () => {
            setLoading(true);
            try {
                const data = await fetchPendingSubscriptions();
                setSubscriptions(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        getPending();
    }, []);

    const handleApprove = async (subscriptionId: number, developerId: number, subscriptionType: string) => {
        setLoading(true);
        try {
            const data = await approveSubscription({
                id: subscriptionId,
                developerId,
                subscriptionType,
                userId: 1,
            });
            alert("Subscription approved successfully!");
            setSubscriptions((prev) => prev.filter((sub) => sub.id !== subscriptionId));
        } catch (err: any) {
            alert(err.message || "Error approving subscription.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-blue-600 mb-6">Pending Subscriptions</h1>
                    {loading && <p className="text-gray-500">Loading...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    <div className="space-y-6">
                        {subscriptions.length === 0 && !loading ? (
                            <p className="text-gray-600">No pending subscriptions found.</p>
                        ) : (
                            subscriptions.map((sub) => (
                                <div
                                    key={sub.id}
                                    className="border rounded-lg shadow p-4 bg-white"
                                >
                                    <p><strong>User ID:</strong> {sub.id}</p>
                                    <p><strong>Subscription Type:</strong> {sub.type}</p>
                                    <p><strong>Status:</strong> {sub.status}</p>
                                    <p><strong>Start Date:</strong> {new Date(sub.startDate).toLocaleDateString()}</p>
                                    <p><strong>End Date:</strong> {new Date(sub.endDate).toLocaleDateString()}</p>

                                    <h4 className="font-semibold mt-4">Payments:</h4>
                                    {sub.payments.length > 0 ? (
                                        <ul className="list-disc list-inside ml-4 space-y-2">
                                            {sub.payments.map((payment) => (
                                                <li key={payment.id}>
                                                    <p><strong>Payment Amount:</strong> {FormatCurrency(payment.amount)}</p>
                                                    <p><strong>Method:</strong> {payment.paymentMethod}</p>
                                                    <p><strong>Status:</strong> {payment.status}</p>
                                                    <p><strong>Transaction ID:</strong> {payment.id}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500">No payments found.</p>
                                    )}

                                    <button
                                        onClick={() => handleApprove(sub.id, sub.id, sub.type)}
                                        disabled={loading}
                                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                    >
                                        Approve
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            <footer className="bg-blue-500 text-white text-center py-4">
                <p>© {new Date().getFullYear()} OntoEmployee. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default DeveloperDashboard;
