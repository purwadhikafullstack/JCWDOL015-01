'use client'

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PublicURL = process.env.NEXT_PUBLIC_BASE_API_URL

export default function PurchaseSubs() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [transactionId, setTransactionId] = useState('');
    const [loading, setLoading] = useState(false);
    const userId = 1

    const HandlePurchase = async () => {
        setLoading(true)
        try {
            const response = await axios.post(`${PublicURL}/subscriptions/purchase`, {
                type,
                paymentMethod,
                transactionId,
                userId,
            })

            alert(response.data.message)
            window.location.href = `/payments/details?subscriptionId=${response.data.subscription.id}`
        } catch (error) {
            alert('Failed to purchase the Subscriptions')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <h1>Subscription Purchase</h1>
            <div className="mb-4">
                <p>Choose Payment Method</p>
                <select
                    className="border p-2 w-full"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <option value="">Select the Method</option>
                    <option value="MANUAL">Manual</option>
                    <option value="GATEWAY">Gateway</option>
                </select>
            </div>
            {paymentMethod === 'MANUAL' && (
                <div className="mb-4">
                    <label htmlFor="transactionId">Bukti Pembayaran / Transaction ID</label>
                    <input
                        type="text"
                        className="border p-2 w-full"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                    />
                </div>
            )}
            <button
                onClick={HandlePurchase}
                className="bg-green-500 text-white px-6 py-3 rounded"
                disabled={loading || !paymentMethod}
            >
                {loading ? 'Memproses...' : 'Konfirmasi Pembelian'}
            </button>
        </div>
    )
}