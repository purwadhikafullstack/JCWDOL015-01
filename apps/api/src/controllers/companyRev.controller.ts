import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fungsi untuk menambah ulasan
export const addAnonymousReview = async (req: Request, res: Response) => {
    try {
        const { userId, companyId, position, rating, salaryEstimate, cultureScore, workLifeBalanceScore, facilitiesScore, careerOpportunitiesScore, comment } = req.body;

        const newReview = await prisma.companyReview.create({
            data: {
                companyId,
                userId,
                position,
                rating,
                salaryEstimate,
                cultureScore,
                workLifeBalanceScore,
                facilitiesScore,
                careerOpportunitiesScore,
                comment,
            }
        });

        res.status(201).json({ message: 'Ulasan berhasil ditambahkan', review: newReview });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error dalam menambahkan ulasan' });
    }
};

export const addCompanyRating = async (req: Request, res: Response) => {
    try {
        const { userId, companyId, position, salaryEstimate, cultureScore, workLifeBalanceScore, facilitiesScore, careerOpportunitiesScore, comment, rating } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { isVerified: true, subscriptionEndDate: true }
        });

        if (!user || !user.isVerified || new Date(user.subscriptionEndDate ?? 0) < new Date()) {
            return res.status(403).json({ message: 'User tidak terverifikasi atau subscription sudah kedaluwarsa' });
        }

        if ([cultureScore, workLifeBalanceScore, facilitiesScore, careerOpportunitiesScore].some(score => score < 1 || score > 5)) {
            return res.status(400).json({ message: 'Nilai rating harus dalam rentang 1-5' });
        }

        const newReview = await prisma.companyReview.create({
            data: {
                companyId,
                userId,
                position,
                salaryEstimate,
                rating: rating || undefined,
                cultureScore,
                workLifeBalanceScore,
                facilitiesScore,
                careerOpportunitiesScore,
                comment,
            }
        });

        res.status(201).json({ message: 'Review dan rating berhasil ditambahkan', review: newReview });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error dalam menambahkan review dan rating' });
    }
};

export const salaryReview = async (req: Request, res: Response) => {
    try {
        const { companyId, position, salaryEstimate, userId, comment } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
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
                rating: 0,
            }
        });

        res.status(201).json({ message: 'Salary Estimate berhasil ditambahkan', review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error dalam menambahkan salary estimate' });
    }
}