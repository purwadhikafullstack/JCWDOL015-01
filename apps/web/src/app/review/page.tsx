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
        <div className="reviews-page">
            <h1>Company Reviews</h1>

            {/* Display reviews */}
            {reviews.length > 0 ? (
                <div className="reviews-list">
                    {reviews.map((review) => (
                        <div key={review.id} className="review-card">
                            <h3>{review.position}</h3>
                            <p>Rating: {review.rating}</p>
                            <p>{review.comment}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No reviews available.</p>
            )}

            <ReviewForm companyId={companyId} />
        </div>
    );
};

export default ReviewsPage;
