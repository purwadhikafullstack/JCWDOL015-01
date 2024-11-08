import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkSubscription = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body

    const subscription = await prisma.subscription.findFirst({
        where: {
            userId,
            endDate: {
                gte: new Date() // Subscription masih berlaku
            }
        }
    });

    if (!subscription) {
        return res.status(403).json({ message: 'Subscription tidak aktif atau telah berakhir' });
    }

    next();
};
