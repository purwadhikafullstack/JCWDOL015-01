import prisma from '@/prisma';
import { Request, Response } from 'express';

export class ApplicationController {
  async submission(req: Request, res: Response) {
    try {
      const { userId, jobId, expectedSalary } = req.body;
      const resumePath = `http://localhost:8000/api/public/resume/${req?.file?.filename}`;

      const user = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });
      if(!user) throw new Error('User not found');

      const job = await prisma.job.findUnique({
        where: {
          id: Number(jobId),
        },
      });
      if (!job) throw new Error('Job not found');

      const application = await prisma.application.create({
        data: {
          userId: user.id,
          jobId: job.id,
          resume: resumePath,
          expectedSalary: Number(expectedSalary),
        },
      });

      return res.status(200).send({
        status: 'success',
        message: 'Application submitted',
        application,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ status: 'error', message: 'Internal server error' });
    }
  }
}
