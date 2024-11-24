import prisma from '@/prisma';
import { Request, Response } from 'express';

export class ApplicationController {
  // Apply for a job
  async applyJob(req: Request, res: Response) {
    try {
      const { jobId, resume, expectedSalary } = req.body;

      if (!resume || !expectedSalary || !jobId) {
        return res
          .status(400)
          .json({ ok: false, message: 'Missing required fields.' });
      }

      // Fetch the job details along with the company info
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
          admin: {
            // Get the admin (company) information
            select: {
              companyName: true,
              companyDescription: true,
              companyLogo: true,
            },
          },
        },
      });

      if (!job) {
        return res.status(404).json({ ok: false, message: 'Job not found.' });
      }

      // Ensure userId is a number
      const userId = req?.user?.id;
      if (typeof userId !== 'number') {
        return res.status(400).json({ ok: false, message: 'Invalid user ID.' });
      }

      // Create the application record
      const application = await prisma.application.create({
        data: {
          jobId,
          userId,
          expectedSalary: parseFloat(expectedSalary),
          resume,
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
          jobCompanyLogoUrl: job.admin.companyLogo,
        },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ ok: false, message: 'Failed to apply for job' });
    }
  }

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
              companyLogo: true,
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
            companyLogoUrl: job.admin.companyLogo,
          },
        },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ ok: false, message: 'Error fetching job details' });
    }
  }
}
