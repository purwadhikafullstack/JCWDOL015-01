import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import {
  updateJobPosting as updateJobService,
  createJobPosting as createJobService,
  deleteJobPosting as deleteJobService,
  toggleJobPublishStatus as togglePublishService,
  getJobPostings as getPostingsService,
  getTotalJobs as getTotalJobsService,
  getJobPostingDetail as getPostingDetailService,
  getLocations as getLocationsService,
} from '@/services/job.service';

import { getTestsByJobId } from '@/services/test.service';
import { checkApplicant, createApplicant } from '@/services/applicant.service';

const prisma = new PrismaClient();

export class JobController {
  async getJobsByGeolocation(req: Request, res: Response) {
    const { lat, lng, radius = 10000, limit = 10 } = req.query;

    // Make sure lat and lng are provided and are valid numbers
    if (!lat || !lng || isNaN(Number(lat)) || isNaN(Number(lng))) {
      return res
        .status(400)
        .json({ error: 'Valid latitude and longitude are required' });
    }

    // Convert query parameters to numbers
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const radiusValue = parseInt(radius as string, 10);
    const limitValue = parseInt(limit as string, 10);

    try {
      // Use raw query to fetch jobs based on geolocation
      const jobs = await prisma.$queryRaw`
        SELECT *, 
               ST_Distance_Sphere(location, ST_GeomFromText('POINT(${longitude} ${latitude})')) AS distance
        FROM Job
        WHERE ST_Distance_Sphere(location, ST_GeomFromText('POINT(${longitude} ${latitude})')) <= ${radiusValue}
        ORDER BY distance ASC
        LIMIT ${limitValue};
      `;

      res.status(200).json(jobs);
    } catch (error) {
      console.error('Error fetching jobs by geolocation:', error);
      res.status(500).json({ error: 'Failed to fetch jobs by geolocation' });
    }
  }
  async updateJobPosting(req: Request, res: Response) {
    const jobId = parseInt(req.params.id, 10);
    const {
      title,
      description,
      category,
      location,
      salary,
      tags,
      expiry_date,
      requires_test,
      remote_option,
      published,
    } = req.body;

    try {
      const banner = req.file ? `/uploads/${req.file.filename}` : undefined;

      const updatedJob = await updateJobService(jobId, {
        title,
        description,
        category,
        location,
        salary: parseFloat(salary),
        tags,
        expiry_date: new Date(expiry_date),
        requires_test: req.body.requires_test === 'true',
        remote_option: req.body.remote_option === 'true',
        published: req.body.is_published === 'true',
        banner,
      });

      if (!updatedJob) {
        return res.status(404).json({ message: 'Job posting not found.' });
      }

      res
        .status(200)
        .json({
          message: 'Postingan pekerjaan berhasil diperbarui.',
          updatedJob,
        });
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({
        message: 'Gagal memperbarui postingan pekerjaan.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async createJobPosting(req: Request, res: Response) {
    try {
      const jobData = {
        ...req.body,
        admin_id: parseInt(req.body.admin_id, 10),
        salary: parseFloat(req.body.salary),
        expiry_date: new Date(req.body.expiry_date),
        created_at: new Date(),
        requires_test: req.body.requires_test === 'true',
        remote_option: req.body.remote_option === 'true',
        published: req.body.is_published === 'true',
      };
      delete jobData.is_published;
      const banner = req.file ? `/uploads/${req.file.filename}` : undefined;
      const job = await createJobService({ ...jobData, banner });
      return res.status(201).json(job);
    } catch (error) {
      return res.status(500).json({
        message: 'Gagal membuat postingan pekerjaan.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async deleteJobPosting(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await deleteJobService(Number(id));
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({
        message: 'Gagal menghapus postingan pekerjaan.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async toggleJobPublishStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { published } = req.body;

    try {
      const updatedJob = await togglePublishService(Number(id), published);
      return res.status(200).json(updatedJob);
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to toggle publish status.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getJobPostings(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      // Konversi ke angka
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;
      const jobs = await getPostingsService({
        ...req.query,
        offset,
        limit: limitNum,
      });
      const jobsWithApplicantCount = jobs.map((job: { applicant: any[] }) => ({
        ...job,
        applicantCount: job.applicant.length,
      }));
      const totalItems = await getTotalJobsService(req.query);
      return res.status(200).json({
        data: jobsWithApplicantCount,
        pagination: {
          totalItems,
          totalPages: Math.ceil(totalItems / limitNum),
          currentPage: pageNum,
          pageSize: limitNum,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Gagal mengambil postingan pekerjaan.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getJobPostingDetail(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const job = await getPostingDetailService(Number(id));
      if (!job)
        return res.status(404).json({ message: 'Job posting not found.' });
      return res.status(200).json(job);
    } catch (error) {
      return res.status(500).json({
        message: 'Gagal mengambil detail pekerjaan.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getJobPostingTest(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const job = await getPostingDetailService(Number(id));
      if (!job)
        return res
          .status(404)
          .json({ message: 'Postingan pekerjaan tidak ditemukan.' });

      const test = await getTestsByJobId(Number(job.id));
      return res.status(200).json(test);
    } catch (error) {
      return res.status(500).json({
        message: 'Gagal mengambil detail pekerjaan.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async applyForJob(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const job = await getPostingDetailService(Number(id));
      if (!job)
        return res
          .status(404)
          .json({ message: 'Postingan pekerjaan tidak ditemukan.' });

      if (job.expiry_date < new Date()) {
        return res
          .status(400)
          .json({ message: 'Postingan pekerjaan telah kadaluarsa.' });
      }

      if (job.published === false) {
        return res
          .status(400)
          .json({ message: 'Postingan pekerjaan tidak dipublikasikan.' });
      }

      if (job.requires_test === true) {
        return res
          .status(400)
          .json({ message: 'Postingan pekerjaan memerlukan tes.' });
      }

      const { userId } = req.body;

      const applicant = await createApplicant(userId, id);
      return res.status(201).json(applicant);
    } catch (error) {
      return res.status(500).json({
        message: 'Gagal melamar pekerjaan.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getLocations(req: Request, res: Response) {
    try {
      const locations = await getLocationsService();
      return res.status(200).json(locations);
    } catch (error) {
      return res.status(500).json({
        message: 'Gagal mengambil daftar lokasi.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
