'use client'

import { FormatCurrency } from "@/lib/currency"
import { addReview, fetchReviews } from "@/services/reviewService"
import { Reviews } from "@/types/review"
import { useEffect, useState } from "react"

export default function Review() {
    const [reviews, setReviews] = useState<Reviews[]>([])
    const [companyId] = useState(1)
    const [newReview, setNewReview] = useState<Partial<Reviews>>({
        userId: 1,
    })

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const fetchedReviews = await fetchReviews(companyId)
                setReviews(fetchedReviews)
            } catch (error) {
                console.log('Error loading Reviews: ', error)
            }
        }
        loadReviews()
    }, [companyId])

    const HandleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newReview.rating || !newReview.comment) {
            alert('Rating and Comment should be filled')
            return
        }
        try {
            await addReview({ ...newReview, companyId })
            alert('Review Submitted Successfully')
            setNewReview({})
        } catch (error) {
            alert('Failed to Submit Review')
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Company Reviews</h1>

            {reviews.length > 0 ? (
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <h1 className="py-4 text-balance"><strong>Here's review for some Employers on the Office</strong></h1>
                    {reviews
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 1)
                        .map((review) => (
                            <div key={review.id} className="space-y-2">
                                <h3 className="text-xl font-semibold">{review.position}</h3>
                                <p><strong>Rating:</strong> {review.rating}</p>
                                <p><strong>Salary Estimate: </strong>{FormatCurrency(review.salaryEstimate)}</p>
                                <p><strong>Culture Score: </strong>{review.cultureScore}</p>
                                <p><strong>Facilities Score: </strong>{review.facilitiesScore}</p>
                                <p><strong>Career Opportunities: </strong>{review.careerOpportunitiesScore}</p>
                                <p><strong>Work Life Balance: </strong>{review.workLifeBalanceScore}</p>
                                <p><strong>Comment: </strong>{review.comment}</p>
                            </div>
                        ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 mb-6">No Reviews available</p>
            )}

            <form
                onSubmit={HandleSubmit}
                className="bg-white p-6 rounded-lg shadow-md space-y-4"
            >
                <h2 className="text-2xl font-bold text-blue-500">Submit a Review</h2>

                <textarea
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    placeholder="Your review comment"
                    value={newReview.comment || ''}
                    onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                    required
                />
                <textarea
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    placeholder="Which position did you work on at the company?"
                    value={newReview.position || ''}
                    onChange={(e) => setNewReview((prev) => ({ ...prev, position: e.target.value }))}
                    required
                />
                <input
                    type="number"
                    min="1"
                    max="5"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    placeholder="Rating (1-5)"
                    value={newReview.rating || ''}
                    onChange={(e) => setNewReview((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                    required
                />

                <input
                    type="number"
                    placeholder="Salary Estimate"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    value={newReview.salaryEstimate || ''}
                    onChange={(e) => setNewReview((prev) => ({ ...prev, salaryEstimate: Number(e.target.value) }))}
                />

                <input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="Culture Score (1-5)"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    value={newReview.cultureScore || ''}
                    onChange={(e) => setNewReview((prev) => ({ ...prev, cultureScore: Number(e.target.value) }))}
                />

                <input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="Work-Life Balance Score (1-5)"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    value={newReview.workLifeBalanceScore || ''}
                    onChange={(e) => setNewReview((prev) => ({ ...prev, workLifeBalanceScore: Number(e.target.value) }))}
                />

                <input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="Facilities Score (1-5)"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    value={newReview.facilitiesScore || ''}
                    onChange={(e) => setNewReview((prev) => ({ ...prev, facilitiesScore: Number(e.target.value) }))}
                />

                <input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="Career Opportunities Score (1-5)"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    value={newReview.careerOpportunitiesScore || ''}
                    onChange={(e) => setNewReview((prev) => ({ ...prev, careerOpportunitiesScore: Number(e.target.value) }))}
                />

                <button
                    type="submit"
                    className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
                >
                    Submit Review
                </button>
            </form>
        </div>
    )
}
