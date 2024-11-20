'use client'
import axios from "axios";
import { useState } from "react";
const PublicURL = process.env.NEXT_PUBLIC_BASE_API_URL

interface Review {
    userId: string;
    companyId: string;
    position: string;
    rating: number;
    salaryEstimate: number;
    cultureScore: number;
    workLifeBalanceScore: number;
    facilitiesScore: number;
    careerOpportunitiesScore: number;
    comment: string;
}

export default function Review() {
    const [form, setForm] = useState<Review>({
        userId: '',
        companyId: '',
        position: '',
        rating: 0,
        salaryEstimate: 0,
        cultureScore: 0,
        workLifeBalanceScore: 0,
        facilitiesScore: 0,
        careerOpportunitiesScore: 0,
        comment: '',
    })

    const [message, setMessage] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: name === 'rating' || name.endsWith('Score') || name === 'salaryEstimate' ? Number(value) : value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${PublicURL}/company-review`)
            setMessage('Review has been added')
            console.log('Response: ', response.data)
            setForm({
                userId: '',
                companyId: '',
                position: '',
                rating: 0,
                salaryEstimate: 0,
                cultureScore: 0,
                workLifeBalanceScore: 0,
                facilitiesScore: 0,
                careerOpportunitiesScore: 0,
                comment: '',
            })
        } catch (error) {
            console.error('Error adding review:', error)
            setMessage('Gagal menambahkan review')
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Tambah Ulasan Perusahaan</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="userId"
                    placeholder="User ID"
                    value={form.userId}
                    onChange={handleChange}
                    className="block w-full p-2 border mb-4"
                />
                <input
                    type="text"
                    name="companyId"
                    placeholder="Company ID"
                    value={form.companyId}
                    onChange={handleChange}
                    className="block w-full p-2 border mb-4"
                />
                <input
                    type="text"
                    name="position"
                    placeholder="Posisi"
                    value={form.position}
                    onChange={handleChange}
                    className="block w-full p-2 border mb-4"
                />
                <input
                    type="number"
                    name="rating"
                    placeholder="Rating (1-5)"
                    value={form.rating}
                    onChange={handleChange}
                    className="block w-full p-2 border mb-4"
                />
                <input
                    type="number"
                    name="salaryEstimate"
                    placeholder="Perkiraan Gaji"
                    value={form.salaryEstimate}
                    onChange={handleChange}
                    className="block w-full p-2 border mb-4"
                />
                <textarea
                    name="comment"
                    placeholder="Komentar"
                    value={form.comment}
                    onChange={handleChange}
                    className="block w-full p-2 border mb-4"
                />
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                    Submit Review
                </button>
            </form>
            {message && <p className="mt-4 text-green-500">{message}</p>}
        </div>
    )
}