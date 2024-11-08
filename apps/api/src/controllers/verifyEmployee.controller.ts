import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const verifyEmployeeStatus = async (req: Request, res: Response, next: NextFunction) => {
    const { companyId, userId } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { verifiedCompany: true },
        });

        if (!user || user.verifiedCompany !== companyId) {
            return res.status(403).json({ message: 'Anda tidak diizinkan untuk mengulas perusahaan ini.' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error dalam verifikasi status karyawan' });
    }
};
