import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export class CompanyController {
  async getCompanies(req: Request, res: Response){
    try {
      const companies = await prisma.admin.findMany({
        include: {
          jobs: true,
        },
      })

      res.status(200).send({
        status: 'success',
        message: 'Companies found',
        companies,
      })
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: 'Internal server error',
      })
    }
  }
}
