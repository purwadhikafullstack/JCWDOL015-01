"use client";

import React, { useEffect, useState } from "react";
import { fetchPendingSubscriptions, approveSubscription } from "@/services/subsServices";
import { Payment, UserSubscription } from "@/types/subscriptions";

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
            const data = await approveSubscription({ id: subscriptionId, developerId, subscriptionType, userId: 1 });
            alert("Subscription approved successfully!");
            setSubscriptions((prev) => prev.filter((sub) => sub.id !== subscriptionId)); 
        } catch (err: any) {
            alert(err.message || "Error approving subscription.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Pending Subscriptions</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {subscriptions.length === 0 && !loading ? (
                    <p>No pending subscriptions found.</p>
                ) : (
                    subscriptions.map((sub) => (
                        <li key={sub.id} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc" }}>
                            <div>
                                <p><strong>User ID:</strong> {sub.id}</p>
                                <p><strong>Subscription Type:</strong> {sub.type}</p>
                                <p><strong>Status:</strong> {sub.status}</p>
                                <p><strong>Start Date:</strong> {new Date(sub.startDate).toLocaleDateString()}</p>
                                <p><strong>End Date:</strong> {new Date(sub.endDate).toLocaleDateString()}</p>

                                <h4>Payments:</h4>
                                {sub.payments.length > 0 ? (
                                    <ul>
                                        {sub.payments.map((payment) => (
                                            <li key={payment.id}>
                                                <p><strong>Payment Amount:</strong> ${payment.amount}</p>
                                                <p><strong>Method:</strong> {payment.paymentMethod}</p>
                                                <p><strong>Status:</strong> {payment.status}</p>
                                                <p><strong>Transaction ID:</strong> {payment.id}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No payments found.</p>
                                )}

                                <button
                                    onClick={() => handleApprove(sub.id, sub.id, sub.type)}
                                    disabled={loading}
                                    style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px" }}
                                >
                                    Approve
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default DeveloperDashboard;