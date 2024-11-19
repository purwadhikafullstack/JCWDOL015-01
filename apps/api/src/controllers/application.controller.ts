import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export class ApplicationController {
  // Apply for a job
  async applyJob(req: Request, res: Response) {
    try {
      const { jobId, resumeUrl, expectedSalary } = req.body;

      if (!resumeUrl || !expectedSalary || !jobId) {
        return res
          .status(400)
          .json({ ok: false, message: 'Missing required fields.' });
      }

      // Fetch the job details along with the company info
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
          admin: {  // Get the admin (company) information
            select: {
              companyName: true,
              companyDescription: true,
              companyLogoUrl: true,
            },
          },
        },
      });

      if (!job) {
        return res.status(404).json({ ok: false, message: 'Job not found.' });
      }

      // Create the application record
      const application = await prisma.application.create({
        data: {
          jobId,
          userId: req?.user?.id, // Assuming user is authenticated
          expectedSalary: parseFloat(expectedSalary),
          resumeUrl,
        },
      });

      return res.status(200).json({
        ok: true,
        message: 'Successfully applied for the job.',
        application,
        jobDetails: {
          jobTitle: job.title,
          jobDescription: job.description,
          jobLocation: job.location,
          jobSalary: job.salary,
          jobCompanyName: job.admin.companyName,
          jobCompanyDescription: job.admin.companyDescription,
          jobCompanyLogoUrl: job.admin.companyLogoUrl,
        },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ ok: false, message: 'Failed to apply for job' });
    }
  },

  // Fetch job details (optional)
  async getJobDetail(req: Request, res: Response) {
    try {
      const { jobId } = req.params;

      const job = await prisma.job.findUnique({
        where: { id: parseInt(jobId) },
        include: {
          admin: {
            select: {
              companyName: true,
              companyDescription: true,
              companyLogoUrl: true,
            },
          },
        },
      });

      if (!job) {
        return res.status(404).json({ ok: false, message: 'Job not found.' });
      }

      return res.status(200).json({
        ok: true,
        jobDetails: {
          jobTitle: job.title,
          jobDescription: job.description,
          jobLocation: job.location,
          jobSalary: job.salary,
          jobTags: job.tags,
          jobExpiryDate: job.expiryDate,
          companyInfo: {
            companyName: job.admin.companyName,
            companyDescription: job.admin.companyDescription,
            companyLogoUrl: job.admin.companyLogoUrl,
          },
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ ok: false, message: 'Error fetching job details' });
    }
  },
};
