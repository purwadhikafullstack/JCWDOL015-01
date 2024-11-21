import React, { useState } from 'react';
import { addReview } from '@/services/reviewService';  // Assuming the function to submit the review is in this service
import { Review } from '@/types/review'; // Assuming Review type is already defined

// Add the ReviewFormProps interface if not already defined
interface ReviewFormProps {
  companyId: number;  // The company ID to associate with the review
}

const ReviewForm: React.FC<ReviewFormProps> = ({ companyId }) => {
  // Initialize the form data with a default structure based on the Review type
  const [formData, setFormData] = useState<Review>({
    id: 0,
    companyId,
    userId: 1,  // Assuming userId is hardcoded for now or you can pass it dynamically
    position: '',
    rating: 1,
    comment: '',
    cultureScore: 0,
    careerOpportunitiesScore: 0,
    facilitiesScore: 0,
    workLifeBalanceScore: 0,
    salaryEstimate: 0,
    createdAt: new Date().toISOString(),
  });

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' || name === 'cultureScore' || name === 'workLifeBalanceScore' || name === 'facilitiesScore' || name === 'careerOpportunitiesScore' || name === 'salaryEstimate'
        ? Number(value)  // Convert numbers from string inputs to actual numbers
        : value, // For other fields (like text), use the string value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addReview(formData);  // Assuming addReview sends the review to the backend
      alert('Review submitted successfully!');
    } catch (error) {
      alert('Error submitting review');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="position"
        value={formData.position}
        onChange={handleChange}
        placeholder="Position"
        required
      />
      <input
        type="number"
        name="rating"
        value={formData.rating}
        onChange={handleChange}
        placeholder="Rating (1-5)"
        min="1"
        max="5"
        required
      />
      <input
        type="number"
        name="salaryEstimate"
        value={formData.salaryEstimate}
        onChange={handleChange}
        placeholder="Salary Estimate"
      />
      <input
        type="number"
        name="cultureScore"
        value={formData.cultureScore}
        onChange={handleChange}
        placeholder="Culture Score (1-5)"
        min="1"
        max="5"
        required
      />
      <input
        type="number"
        name="workLifeBalanceScore"
        value={formData.workLifeBalanceScore}
        onChange={handleChange}
        placeholder="Work Life Balance Score (1-5)"
        min="1"
        max="5"
        required
      />
      <input
        type="number"
        name="facilitiesScore"
        value={formData.facilitiesScore}
        onChange={handleChange}
        placeholder="Facilities Score (1-5)"
        min="1"
        max="5"
        required
      />
      <input
        type="number"
        name="careerOpportunitiesScore"
        value={formData.careerOpportunitiesScore}
        onChange={handleChange}
        placeholder="Career Opportunities Score (1-5)"
        min="1"
        max="5"
        required
      />
      <textarea
        name="comment"
        value={formData.comment}
        onChange={handleChange}
        placeholder="Your comment"
        required
      />
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
