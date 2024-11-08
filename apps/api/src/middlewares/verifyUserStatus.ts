import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const verifyUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isVerified: true }
    });

    if (!user || !user.isVerified) {
        return res.status(403).json({ message: 'Hanya user terverifikasi yang dapat menulis ulasan' });
    }

    next();
};
