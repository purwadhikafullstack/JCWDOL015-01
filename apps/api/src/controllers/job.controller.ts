// job.controller.ts
import { Request, Response } from 'express';
import {createJobPosting, updateJobPosting, deleteJobPosting, toggleJobPublishStatus, getJobPostings, getJobPostingDetail} from '@/service/job.service';

export class JobController {
    async createJobPosting(req: Request, res: Response) {
        try {
            const job = await createJobPosting(req.body);
            return res.status(201).json(job);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({ message: 'Failed to create job posting.', error: error.message });
            }
            return res.status(500).json({ message: 'Failed to create job posting.', error: 'Unknown error' });
        }
    }

    async updateJobPosting(req: Request, res: Response) {
        const { id } = req.params;
        const updateData = req.body;

        try {
            const updatedJob = await updateJobPosting(Number(id), updateData);
            return res.status(200).json(updatedJob);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({ message: 'Failed to update job posting.', error: error.message });
            }
            return res.status(500).json({ message: 'Failed to update job posting.', error: 'Unknown error' });
        }
    }

    async deleteJobPosting(req: Request, res: Response) {
        const { id } = req.params;

        try {
            await deleteJobPosting(Number(id));
            return res.status(204).send();
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({ message: 'Failed to delete job posting.', error: error.message });
            }
            return res.status(500).json({ message: 'Failed to delete job posting.', error: 'Unknown error' });
        }
    }

    async toggleJobPublishStatus(req: Request, res: Response) {
        const { id } = req.params;
        const { published } = req.body;

        try {
            const updatedJob = await toggleJobPublishStatus(Number(id), published);
            return res.status(200).json(updatedJob);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({ message: 'Failed to toggle publish status.', error: error.message });
            }
            return res.status(500).json({ message: 'Failed to toggle publish status.', error: 'Unknown error' });
        }
    }

    async getJobPostings(req: Request, res: Response) {
        try {
            const jobs = await getJobPostings(req.query as any); // Adjust as necessary for your query parameters
            const jobsWithApplicantCount = jobs.map((job) => ({
                ...job,
                applicantCount: job.applicant.length,
            }));
            return res.status(200).json(jobsWithApplicantCount);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({ message: 'Failed to fetch job postings.', error: error.message });
            }
            return res.status(500).json({ message: 'Failed to fetch job postings.', error: 'Unknown error' });
        }
    }

    async getJobPostingDetail(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const job = await getJobPostingDetail(Number(id));
            if (!job) return res.status(404).json({ message: 'Job posting not found.' });
            return res.status(200).json(job);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({ message: 'Failed to fetch job details.', error: error.message });
            }
            return res.status(500).json({ message: 'Failed to fetch job details.', error: 'Unknown error' });
        }
    }
}
