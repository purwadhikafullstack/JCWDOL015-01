import { Request, Response } from 'express';
import prisma from '../prisma'; // adjust this path if needed

export const addAnonymousReview = async (req: Request, res: Response) => {
    try {
        const {
            userId,
            companyId,
            position,
            rating,
            salaryEstimate,
            cultureScore,
            workLifeBalanceScore,
            facilitiesScore,
            careerOpportunitiesScore,
            comment,
        } = req.body;

        // Validate required fields
        if (!userId || !companyId || !position || !comment) {
            return res.status(400).json({ message: "Missing required fields: userId, companyId, position, or comment." });
        }

        // Validate rating scores (if they exist)
        const scores = [
            { name: "rating", value: rating },
            { name: "cultureScore", value: cultureScore },
            { name: "workLifeBalanceScore", value: workLifeBalanceScore },
            { name: "facilitiesScore", value: facilitiesScore },
            { name: "careerOpportunitiesScore", value: careerOpportunitiesScore },
        ];

        for (const { name, value } of scores) {
            if (value !== undefined && (value < 1 || value > 5)) {
                return res.status(400).json({ message: `${name} must be between 1 and 5.` });
            }
        }

        // Create a new anonymous review
        const newReview = await prisma.companyReview.create({
            data: {
                companyId,
                userId,
                position,
                rating: rating || null,
                salaryEstimate: salaryEstimate || null,
                cultureScore: cultureScore || null,
                workLifeBalanceScore: workLifeBalanceScore || null,
                facilitiesScore: facilitiesScore || null,
                careerOpportunitiesScore: careerOpportunitiesScore || null,
                comment,
            },
        });

        res.status(201).json({ message: "Review successfully added.", review: newReview });
    } catch (error) {
        console.error("Error in addAnonymousReview:", error);

        if (error instanceof Error && error.message.includes("prisma")) {
            return res.status(400).json({
                message: "Database error. Please check your data.",
            });
        }

        res.status(500).json({ message: "Error adding review."});
    }
};

// Function to add a company rating (only for verified users)
export const addCompanyRating = async (req: Request, res: Response) => {
    try {
        const { userId, companyId, position, salaryEstimate, cultureScore, workLifeBalanceScore, facilitiesScore, careerOpportunitiesScore, comment, rating } = req.body;

        if (!userId || !companyId || !position || !salaryEstimate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Verify user subscription status
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { isVerified: true, subscriptionEndDate: true }
        });

        if (!user || !user.isVerified || new Date(user.subscriptionEndDate ?? 0) < new Date()) {
            return res.status(403).json({ message: 'User tidak terverifikasi atau subscription sudah kedaluwarsa' });
        }

        // Ensure all rating scores are within the valid range
        if ([cultureScore, workLifeBalanceScore, facilitiesScore, careerOpportunitiesScore].some(score => score < 1 || score > 5)) {
            return res.status(400).json({ message: 'Nilai rating harus dalam rentang 1-5' });
        }

        const newReview = await prisma.companyReview.create({
            data: {
                companyId,
                userId,
                position,
                salaryEstimate,
                rating: rating || undefined,  // rating is optional, set to undefined if not provided
                cultureScore,
                workLifeBalanceScore,
                facilitiesScore,
                careerOpportunitiesScore,
                comment,
            }
        });

        res.status(201).json({ message: 'Review dan rating berhasil ditambahkan', review: newReview });
    } catch (error) {
        console.error('Error in addCompanyRating:', error);
        res.status(500).json({ message: 'Error dalam menambahkan review dan rating' });
    }
};

// Function to handle salary reviews (without detailed scores)
export const salaryReview = async (req: Request, res: Response) => {
    try {
        const { companyId, position, salaryEstimate, userId, comment } = req.body;

        if (!userId || !salaryEstimate || !companyId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { isVerified: true, subscriptionEndDate: true }
        });

        if (!user || !user.isVerified || new Date(user.subscriptionEndDate ?? 0) < new Date()) {
            return res.status(403).json({ message: 'User tidak terverifikasi atau subscription sudah kedaluwarsa' });
        }

        const review = await prisma.companyReview.create({
            data: {
                companyId,
                userId,
                position: position || "",
                salaryEstimate,
                cultureScore: 0,
                workLifeBalanceScore: 0,
                facilitiesScore: 0,
                careerOpportunitiesScore: 0,
                comment,
                rating: 0,  // Default to 0 for salary review
            }
        });

        res.status(201).json({ message: 'Salary Estimate berhasil ditambahkan', review });
    } catch (error) {
        console.error('Error in salaryReview:', error);
        res.status(500).json({ message: 'Error dalam menambahkan salary estimate' });
    }
}

// Function to submit review (check for required fields and create review)
export const submitReview = async (req: Request, res: Response) => {
    const { userId, adminId, rating, comment, salary, workLifeBalanceScore, position, cultureScore, facilitiesScore, careerOpportunitiesScore } = req.body;

    // Check for required fields
    if (!userId || !adminId || !rating || !comment || !salary || !position) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Create the review
        const newReview = await prisma.companyReview.create({
            data: {
                userId,
                companyId: adminId,
                position,
                rating,
                comment,
                salaryEstimate: salary,
                workLifeBalanceScore,
                cultureScore,
                facilitiesScore,
                careerOpportunitiesScore
            },
        });

        res.status(201).json({ message: 'Review submitted successfully.', data: newReview });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

export const getReviewsByCompany = async (req: Request, res: Response) => {
    const { companyId } = req.params;

    try {
        const reviews = await prisma.companyReview.findMany({
            where: { companyId: parseInt(companyId) },
            include: {
                user: {
                    select: { name: true }, // Optional: include user details
                },
            },
        });

        if (!reviews.length) {
            // No reviews found
            return res.status(200).json([]); // Return empty array for no reviews
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Error fetching reviews." });
    }
};

