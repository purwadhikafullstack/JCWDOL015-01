import { Reviews } from '@/types/review'
import axiosInstance from '@/lib/axiosInstance'

export const fetchReviews = async (companyId: number): Promise<Reviews[]> => {
  try {
    const response = await axiosInstance.get(`/reviews/${companyId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching reviews:', error)
    throw new Error('Error fetching reviews')
  }
};

export const addReview = async (reviewData: Partial<Reviews>) => {
  try {
    const response = await axiosInstance.post('/reviews/anonymous', reviewData)
    return response.data
  } catch (error) {
    console.error('Error adding review:', error)
    throw new Error('Error adding review')
  }
}
