"use client"
import React, { useState, useEffect } from 'react';
import ReviewForm from '@/components/Review/reviewForm';
import { fetchReviews } from '@/services/reviewService';
import { Review } from '@/types/review';

const ReviewsPage: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [companyId, setCompanyId] = useState<number>(1); // Example companyId, replace with actual value

    // Fetch reviews for the company when the component mounts
    useEffect(() => {
        const loadReviews = async () => {
            try {
                const fetchedReviews = await fetchReviews(companyId); // Fetch reviews from the API
                setReviews(fetchedReviews);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        loadReviews();
    }, [companyId]); // Dependency on companyId so reviews are re-fetched if it changes

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Page Title */}
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Company Reviews</h1>

            {/* Display Reviews */}
            {reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{review.position}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                                <span className="font-bold">Rating:</span> {review.rating}/5
                            </p>
                            <p className="text-gray-700">{review.comment}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-lg text-gray-700 text-center">No reviews available.</p>
            )}

            {/* Review Form */}
            <div className="mt-8">
                <ReviewForm companyId={companyId} />
            </div>
        </div>

    );
};

export default ReviewsPage;
