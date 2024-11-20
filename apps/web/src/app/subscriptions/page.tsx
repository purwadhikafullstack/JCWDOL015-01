'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
const PublicURL = process.env.NEXT_PUBLIC_BASE_API_URL

interface Subscription {
    type: string;
    cost: number;
    features: string[];
    durationInDays: number;
}

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await axios.get(`${PublicURL}/subscriptions/categories`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setSubscriptions(response.data);
                setLoading(false);
            } catch (err) {
                setError('Gagal mengambil data');
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <p className='text-xl'>Loading...</p>
            </div>
        )
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Kategori Langganan</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptions.map((subscription) => (
                    <div
                        key={subscription.type}
                        className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 transform transition-all hover:scale-105 hover:shadow-xl"
                    >
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-3">{subscription.type}</h2>
                            <p className="text-lg text-gray-600 mb-2">Biaya: <span className="font-bold text-green-600">IDR {subscription.cost.toLocaleString()}</span></p>
                            <p className="text-lg text-gray-600 mb-4">Durasi: <span className="font-bold text-blue-600">{subscription.durationInDays} hari</span></p>
                            <div>
                                <h3 className="text-xl font-medium text-gray-700 mb-2">Fitur:</h3>
                                <ul className="list-inside list-disc text-gray-600">
                                    {subscription.features.map((feature, idx) => (
                                        <li key={idx} className="mb-1">{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <Link href={'/subscriptions/purchase'} passHref><button>Buy Subs</button></Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Subscriptions
