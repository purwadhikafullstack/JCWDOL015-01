// import { Request, Response } from 'express';
// import { Decimal } from '@prisma/client/runtime/library'; // Ensure you import Decimal correctly
// import {
//     updateJobPosting as updateJobService,
//     createJobPosting as createJobService,
//     deleteJobPosting as deleteJobService,
//     toggleJobPublishStatus as togglePublishService,
//     getJobPostings as getPostingsService,
//     getJobPostingDetail as getPostingDetailService
// } from '@/services/job.service'; // Import necessary service methods

// export class JobController {
//     async updateJobPosting(req: Request, res: Response) {
//         const jobId = parseInt(req.params.id, 10);
//         const { title, description, category, location, salary, tags, expiry_date, requires_test, remote_option, is_published } = req.body;
//         const banner = req.file ? `/uploads/${req.file.filename}` : undefined; // Handle uploaded file

//         try {
//             const updatedJob = await updateJobService(jobId, {
//                 title,
//                 description,
//                 category,
//                 location,
//                 salary: parseFloat(salary), // Convert salary to number if necessary
//                 tags,
//                 expiry_date,
//                 requires_test,
//                 remote_option,
//                 is_published,
//                 banner,
//             });

//             if (!updatedJob) {
//                 return res.status(404).json({ message: "Job posting not found." });
//             }

//             res.status(200).json({ message: "Job posting updated successfully.", updatedJob });
//         } catch (error) {
//             console.error("Update error:", error);
//             const errorMessage = (error as Error).message; // Type assertion
//             res.status(500).json({ message: "Failed to update job posting.", error: errorMessage });
//         }
//     }

//     async createJobPosting(req: Request, res: Response) {
//         try {
//             const jobData = req.body;
//             const banner = req.file ? `/uploads/${req.file.filename}` : undefined; // Save path if file uploaded
//             const job = await createJobService({ ...jobData, banner });
//             return res.status(201).json(job);
//         } catch (error: unknown) {
//             return res.status(500).json({ message: 'Failed to create job posting.', error: error instanceof Error ? error.message : 'Unknown error' });
//         }
//     }

//     async deleteJobPosting(req: Request, res: Response) {
//         const { id } = req.params;

//         try {
//             await deleteJobService(Number(id)); // Pass the id
//             return res.status(204).send(); // No content to return
//         } catch (error: unknown) {
//             return res.status(500).json({ message: 'Failed to delete job posting.', error: error instanceof Error ? error.message : 'Unknown error' });
//         }
//     }

//     async toggleJobPublishStatus(req: Request, res: Response) {
//         const { id } = req.params;
//         const { published } = req.body;

//         try {
//             const updatedJob = await togglePublishService(Number(id), published);
//             return res.status(200).json(updatedJob);
//         } catch (error: unknown) {
//             return res.status(500).json({ message: 'Failed to toggle publish status.', error: error instanceof Error ? error.message : 'Unknown error' });
//         }
//     }

//     async getJobPostings(req: Request, res: Response) {
//         try {
//             const jobs = await getPostingsService(req.query as any); // Adjust as necessary for your query parameters
//             const jobsWithApplicantCount = jobs.map((job) => ({
//                 ...job,
//                 applicantCount: job.applicant.length,
//             }));
//             return res.status(200).json(jobsWithApplicantCount);
//         } catch (error: unknown) {
//             return res.status(500).json({ message: 'Failed to fetch job postings.', error: error instanceof Error ? error.message : 'Unknown error' });
//         }
//     }

//     async getJobPostingDetail(req: Request, res: Response) {
//         const { id } = req.params; // `id` is retrieved from the request params

//         try {
//             const job = await getPostingDetailService(Number(id)); // Pass `id` to service function
//             if (!job) return res.status(404).json({ message: 'Job posting not found.' });
//             return res.status(200).json(job);
//         } catch (error: unknown) {
//             return res.status(500).json({ message: 'Failed to fetch job details.', error: error instanceof Error ? error.message : 'Unknown error' });
//         }
//     }
// }

import { Request, Response } from 'express';
import {
    updateJobPosting as updateJobService,
    createJobPosting as createJobService,
    deleteJobPosting as deleteJobService,
    toggleJobPublishStatus as togglePublishService,
    getJobPostings as getPostingsService,
    getTotalJobs as getTotalJobsService,
    getJobPostingDetail as getPostingDetailService,
} from '@/services/job.service';

import { getTestsByJobId } from '@/services/test.service';

export class JobController {
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
            is_published,
        } = req.body;

        const banner = req.file ? `/uploads/${req.file.filename}` : undefined;

        try {
            const updatedJob = await updateJobService(jobId, {
                title,
                description,
                category,
                location,
                salary: parseFloat(salary),
                tags,
                expiry_date,
                requires_test,
                remote_option,
                is_published,
                banner,
            });

            if (!updatedJob) {
                return res.status(404).json({ message: 'Job posting not found.' });
            }

            res
                .status(200)
                .json({ message: 'Job posting updated successfully.', updatedJob });
        } catch (error) {
            console.error('Update error:', error);
            res
                .status(500)
                .json({
                    message: 'Failed to update job posting.',
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
            return res
                .status(500)
                .json({
                    message: 'Failed to create job posting.',
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
            return res
                .status(500)
                .json({
                    message: 'Failed to delete job posting.',
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
            return res
                .status(500)
                .json({
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

            const jobs = await getPostingsService({...req.query, offset, limit:limitNum});
            const jobsWithApplicantCount = jobs.map((job) => ({
                ...job,
                applicantCount: job.applicant.length,
            }));
            const totalItems = await getTotalJobsService(req.query);
            return res.status(200).json({
                data:jobsWithApplicantCount,
                pagination: {
                    totalItems,
                    totalPages: Math.ceil(totalItems / limitNum),
                    currentPage: pageNum,
                    pageSize: limitNum,
                },
            });
        } catch (error) {
            return res
                .status(500)
                .json({
                    message: 'Failed to fetch job postings.',
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
            return res
                .status(500)
                .json({
                    message: 'Failed to fetch job details.',
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
        }
    }

    async getJobPostingTest(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const job = await getPostingDetailService(Number(id));
            if (!job)
                return res.status(404).json({ message: 'Job posting not found.' });

            const test = await getTestsByJobId(Number(job.id));
            return res.status(200).json(test);
        } catch (error) {
            return res
                .status(500)
                .json({
                    message: 'Failed to fetch job details.',
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
        }
    }
}
