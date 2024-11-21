import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const Prisma = new PrismaClient()

export const VerifyEmployee = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, adminId } = req.body
    if (!userId || !adminId) {
        return res.status(400).send({msg: 'Missing user or company'})
    }
    try {
        const user = await Prisma.user.findFirst({
            where: {
                id: userId,
                verifiedCompany: adminId,
            }
        })
        next()
    } catch (error) {
        console.error('Error in verifyEmployeeStatus:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}