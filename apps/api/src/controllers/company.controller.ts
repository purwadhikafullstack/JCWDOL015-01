import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export class CompanyController {
  async getCompanyAndJobs(req: Request, res: Response) {
    try {
      const company = await prisma.admin.findMany({
        include: {
          jobs: true,
        },
      });

      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }

      return res.status(200).send({
        status: 'success',
        data: company,
      });
    } catch (error) {
      console.error('Error fetching company and jobs:', error);
      return res
        .status(500)
        .json({ error: 'Failed to fetch company and jobs' });
    }
  }
}
