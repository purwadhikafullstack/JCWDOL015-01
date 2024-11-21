import React from 'react';
import { Review } from '@/types/review';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="review-card">
      <h3>{review.position}</h3>
      <p>Rating: {review.rating}</p>
      <p>{review.comment}</p>
    </div>
  );
};

export default ReviewCard;
