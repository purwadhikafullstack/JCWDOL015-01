import { PrismaClient, DeveloperRole } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const Prisma = new PrismaClient();

export const verifyDeveloperRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const developerMail = process.env.MAIL_USER

        if (!developerMail) {
            return res.status(400).json({ message: "Developer ID is missing" });
        }

        const developer = await Prisma.developer.findUnique({
            where: {
                email: developerMail,
            },
        });

        if (!developer) {
            return res.status(404).json({ message: "Developer not found" });
        }

        if (developer.role !== DeveloperRole.ADMIN) {
            return res.status(403).json({ message: "Forbidden: Insufficient role" });
        }

        next();
    } catch (error) {
        console.error("Error verifying developer role:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};
