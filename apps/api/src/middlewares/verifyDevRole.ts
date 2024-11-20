import { DeveloperRole, PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const Prisma = new PrismaClient()

export const verifyDeveloperRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { developerId } = req.body;

        // Ambil data developer berdasarkan ID
        const developer = await Prisma.developer.findUnique({
            where: { id: developerId }
        });

        if (!developer) {
            return res.status(404).json({ message: 'Developer tidak ditemukan' });
        }

        // Cek apakah role-nya adalah ADMIN
        if (developer.role !== DeveloperRole.ADMIN) {
            return res.status(403).json({ message: 'Akses hanya untuk developer Admin.' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan' });
    }
};
