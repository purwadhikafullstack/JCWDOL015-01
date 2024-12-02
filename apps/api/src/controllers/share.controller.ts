import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const Prisma = new PrismaClient()

export const shareJobs = async (req: Request, res: Response) => {
    const { id, adminId, title, description, location, salary, tags } = req.body
    try {
        const jobShare = await Prisma.job.findUnique({
            where: {
                id,
                adminId,
                title,
                description,
                location,
                salary,
                tags,
                createdAt: new Date(),
                remoteOption: true || false
            }
        })
    
        res.status(200).json(jobShare)
    } catch (error) {
        res.status(500).send({message: "Error"})
        console.error("Error on Internal Server: ", error)
    }


}