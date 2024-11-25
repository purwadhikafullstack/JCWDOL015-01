import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const verifyUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;

    if (!userId) return res.status(400).send({ message: 'User was not found on request' });

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            select: {
                id: true,
                isVerified: true,
                subscriptionType: true,
                subscriptionEndDate: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const currentDate = new Date();
        if (user.subscriptionType && user.subscriptionEndDate && user.subscriptionEndDate > currentDate) {
            await prisma.user.update({
                where: { id: Number(userId) },
                data: { isVerified: true },
            });
            next();
        } else {
            await prisma.user.update({
                where: { id: Number(userId) },
                data: { isVerified: false },
            });
            return res.status(403).json({ message: 'User is not verified. Please purchase a subscription.' });
        }
    } catch (error) {
        console.error('Error in verifyUserStatus:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
