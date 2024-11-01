// import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// // Create a Job Posting
// export const createJobPosting = async (req: Request, res: Response) => {
//   const { title, description, category, location, salary, tags, expiry_date, admin_id } = req.body; // Include admin_id from req.body
//   try {
//     const job = await prisma.job.create({
//       data: {
//         admin_id,
//         title,
//         description,
//         category,
//         location,
//         salary,
//         tags,
//         expiry_date,
//       },
//     });
//     res.status(201).json(job);
//   } catch (error) {
//     res.status(500).json({ error: "Error creating job posting" });
//   }
// };

// // Update a Job Posting
// export const updateJobPosting = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { title, description, category, location, salary, tags, expiry_date, published } = req.body;
//   try {
//     const job = await prisma.job.update({
//       where: { id: Number(id) },
//       data: { title, description, category, location, salary, tags, expiry_date, published },
//     });
//     res.json(job);
//   } catch (error) {
//     res.status(500).json({ error: "Error updating job posting" });
//   }
// };

// // Delete a Job Posting
// export const deleteJobPosting = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     await prisma.job.delete({
//       where: { id: Number(id) },
//     });
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ error: "Error deleting job posting" });
//   }
// };

// // Publish or Unpublish Job Posting
// export const toggleJobPublishStatus = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { published } = req.body;
//   try {
//     const job = await prisma.job.update({
//       where: { id: Number(id) },
//       data: { published },
//     });
//     res.json(job);
//   } catch (error) {
//     res.status(500).json({ error: "Error toggling publish status" });
//   }
// };

// // List Job Postings with Filters, Sorting, and Applicant Count
// export const getJobPostings = async (req: Request, res: Response) => {
//   const { title, category, sortField, sortOrder } = req.query;
//   try {
//     const jobs = await prisma.job.findMany({
//       where: {
//         title: title ? { contains: title as string } : undefined,
//         category: category ? { contains: category as string } : undefined,
//       },
//       orderBy: sortField
//         ? {
//             [sortField as string]: sortOrder === 'desc' ? 'desc' : 'asc',
//           }
//         : undefined,
//       include: {
//         applicant: true, 
//       },
//     });
    
//     const jobsWithApplicantCount = jobs.map((job) => ({
//       ...job,
//       applicantCount: job.applicant.length,
//     }));
//     res.json(jobsWithApplicantCount);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching job postings" });
//   }
// };


// // Get Job Posting Details with Applicants
// export const getJobPostingDetail = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     const job = await prisma.job.findUnique({
//       where: { id: Number(id) },
//       include: { applicant: true },
//     });
//     if (!job) return res.status(404).json({ message: "Job posting not found" });
//     res.json(job);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching job details" });
//   }
// };

// job.service.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createJobPosting = async (data: {
  title: string;
  description: string;
  category: string;
  location: string;
  salary?: number;
  tags?: string;
  expiry_date: Date;
  admin_id: number;
}) => {
  return await prisma.job.create({
    data,
  });
};

export const updateJobPosting = async (id: number, data: {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  salary?: number;
  tags?: string;
  expiry_date?: Date;
  published?: boolean;
}) => {
  return await prisma.job.update({
    where: { id },
    data,
  });
};

export const deleteJobPosting = async (id: number) => {
  return await prisma.job.delete({
    where: { id },
  });
};

export const toggleJobPublishStatus = async (id: number, published: boolean) => {
  return await prisma.job.update({
    where: { id },
    data: { published },
  });
};

export const getJobPostings = async (query: {
    title?: string;
    category?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const { title, category, sortField, sortOrder } = query;
  
    return await prisma.job.findMany({
      where: {
        title: title ? { contains: title } : undefined,
        category: category ? { contains: category } : undefined,
      },
      orderBy: sortField
        ? { [sortField]: sortOrder ?? 'asc' }
        : undefined,
      include: {
        applicant: true, 
      },
    });
  };
  

export const getJobPostingDetail = async (id: number) => {
  return await prisma.job.findUnique({
    where: { id },
    include: { applicant: true },
  });
};
