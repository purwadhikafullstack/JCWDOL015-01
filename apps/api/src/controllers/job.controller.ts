import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export class JobController {
  async getJobs(req: Request, res: Response) {
    try {
      const jobs = await prisma.job.findMany({
        include: {
          admin: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return res.status(200).send({
        status: 'success',
        message: 'Jobs retrieved',
        jobs,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ status: 'error', message: 'Internal server error' });
    }
  }

  async jobApplication(req: Request, res: Response) {
    try {
      const { userId, jobId } = req.body;
      const job = await prisma.job.findUnique({
        where: {
          id: Number(jobId),
        },
      });

      if (!job) throw new Error('Job not found');

      const user = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });
      return res.status(200).send({
        status: 'success',
        message: 'Job application successful',
        job,
        user,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ status: 'error', message: 'Internal server error' });
    }
  }

  async displayJob(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const job = await prisma.job.findUnique({
        where: {
          id: Number(jobId),
        },
        include:{
          admin: true,
        }
      });

      return res.status(200).send({
        status: 'success',
        message: 'Job retrieved',
        job,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ status: 'error', message: 'Internal server error' });
    }
  }
}
