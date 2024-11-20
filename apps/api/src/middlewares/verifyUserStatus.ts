
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const verifyUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;

    if (!userId) return res.status(400).send({message: 'User was not found on request'})
    
    try {
        // Ambil user berdasarkan ID yang diberikan
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                isVerified: true,
                subscriptionType: true,
                subscriptionEndDate: true,
            },
        });

        // Cek apakah user ditemukan
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Logika verifikasi status
        const currentDate = new Date();

        // Jika user memiliki subscription yang masih aktif, set isVerified menjadi true
        if (user.subscriptionType && user.subscriptionEndDate && user.subscriptionEndDate > currentDate) {
            await prisma.user.update({
                where: { id: userId },
                data: { isVerified: true },
            });
            next();
        } else {
            // Jika tidak memiliki subscription aktif, set isVerified menjadi false
            await prisma.user.update({
                where: { id: userId },
                data: { isVerified: false },
            });
            return res.status(403).json({ message: 'User is not verified. Please purchase a subscription.' });
        }
    } catch (error) {
        console.error('Error in verifyUserStatus:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
