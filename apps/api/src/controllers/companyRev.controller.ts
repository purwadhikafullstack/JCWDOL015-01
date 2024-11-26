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

