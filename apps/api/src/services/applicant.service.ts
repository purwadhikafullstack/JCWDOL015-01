// import prisma from "@/prisma";

// // Fetch applicants by job posting ID
// export const getApplicantsByJobPosting = async (jobId: number) => {
//   return await prisma.applicant.findMany({
//     where: { job_posting_id: jobId },
//     include: {
//       user: {
//         select: {
//           name: true,
//           email: true,
//           profile_picture_url: true,
//           birth_date: true,
//           education: true,
//         },
//       },
//       result: true,
//     },
//   });
// };

// // Fetch applicant test results
// export const getApplicantTestResults = async () => {
//   return await prisma.applicant.findMany({
//     select: {
//       id: true,
//       user: {
//         select: {
//           name: true,
//           email: true,
//         },
//       },
//       result: {
//         select: {
//           score: true,
//           passed: true,
//         },
//       },
//     },
//   });
// };

// // Accept an applicant (update their applicant status)
// export const acceptApplicant = async (applicantId: number, jobId: number) => {
//   const applicant = await prisma.applicant.findFirst({
//     where: {
//       user_id: applicantId,
//       job_id: jobId,
//     },
//   });

//   if (applicant) {
//     return await prisma.applicant.update({
//       where: { id: applicant.id },
//       data: { status: 'accepted' }, // Update the status to accepted
//     });
//   }

//   throw new Error("applicant not found for this applicant and job posting");
// };

// // Reject an applicant (update their applicant status)
// export const rejectApplicant = async (applicantId: number, jobId: number) => {
//   const applicant = await prisma.applicant.findFirst({
//     where: {
//       user_id: applicantId,
//       job_id: jobId,
//     },
//   });

//   if (applicant) {
//     return await prisma.applicant.update({
//       where: { id: applicant.id },
//       data: { status: 'rejected' }, // Update the status to rejected
//     });
//   }

//   throw new Error("applicant not found for this applicant and job posting");
// };

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// // Fetch all applicants
// export const getAllApplicants = async () => {
//   return await prisma.applicant.findMany({
//     include: { user: true, job: true }, // Include related user and job data if necessary
//   });
// };

// // Fetch applicants by job posting ID with filtering
// export const getApplicantsByJobPosting = async (jobId: number, filters: any) => {
//   const { name, salary, education } = filters;

//   return await prisma.applicant.findMany({
//     where: {
//       job_id: jobId,
//       expected_salary: salary ? { gte: parseFloat(salary) } : undefined,
//       user: {
//         name: name ? { contains: name } : undefined,
//         education: education ? { contains: education } : undefined,
//       },
//     },
//     include: {
//       user: {
//         include: {
//           applicant: true, // Fetch applicant details associated with the user
//         },
//       },
//       job: true, // Include the job posting details
//       interview_schedule: true, // Include interview schedules if relevant
//     },
//     orderBy: { applied_at: 'asc' },
//   });
// };

// // Fetch a single applicant by ID
// export const getApplicantById = async (id: number) => {
//   return await prisma.applicant.findUnique({
//     where: { id },
//     include: { user: true, job: true }, // Include related user and job data
//   });
// };

// // Accept an applicant (update their applicant status)
// export const acceptApplicant = async (applicantId: number, jobId: number) => {
//   const applicant = await prisma.applicant.findFirst({
//     where: {
//       user_id: applicantId,
//       job_id: jobId,
//     },
//   });

//   if (applicant) {
//     return await prisma.applicant.update({
//       where: { id: applicant.id },
//       data: { status: 'accepted' }, // Update the status to accepted
//     });
//   }

//   throw new Error("applicant not found for this applicant and job posting");
// };

// // Reject an applicant (update their applicant status)
// export const rejectApplicant = async (applicantId: number, jobId: number) => {
//   const applicant = await prisma.applicant.findFirst({
//     where: {
//       user_id: applicantId,
//       job_id: jobId,
//     },
//   });

//   if (applicant) {
//     return await prisma.applicant.update({
//       where: { id: applicant.id },
//       data: { status: 'rejected' }, // Update the status to rejected
//     });
//   }

//   throw new Error("applicant not found for this applicant and job posting");
// };

// // Fetch test results for all applicants
// export const getApplicantTestResults = async () => {
//   return await prisma.result.findMany({
//     include: { applicant: true },
//   });
// };

import { PrismaClient } from '@prisma/client';
import e from 'express';

const prisma = new PrismaClient();

// Fetch all applicants
export const getAllApplicants = async (query: {
  job_posting_id?: string;
}) => {
  console.log(query.job_posting_id);
  return await prisma.applicant.findMany({
    include: { user: true, job: true }, // Include related user and job data if necessary
    where: { job_posting_id: Number(query.job_posting_id) },
  });
};

// Fetch applicants by job posting ID with filtering
export const getApplicantsByJobPosting = async (jobId: number, filters: any) => {
  const { name, salary, education } = filters;

  return await prisma.applicant.findMany({
    where: {
      job_posting_id: jobId,
      expected_salary: salary ? { gte: parseFloat(salary) } : undefined,
      user: {
        name: name ? { contains: name } : undefined,
        education: education ? { contains: education } : undefined,
      },
    },
    include: {
      user: {
        include: {
          applicant: true, // Fetch applicant details associated with the user
        },
      },
      job: true, // Include the job posting details
      interview_schedule: true, // Include interview schedules if relevant
    },
    orderBy: { applied_at: 'asc' },
  });
};

// Fetch a single applicant by ID
export const getApplicantById = async (id: number) => {
  return await prisma.applicant.findUnique({
    where: { id },
    include: { user: true, job: true }, // Include related user and job data
  });
};

// Accept an applicant (update their applicant status)
export const acceptApplicant = async (applicantId: number, jobId: number) => {
  const applicant = await prisma.applicant.findFirst({
    where: {
      id: applicantId,
      job_posting_id: jobId,
    },
  });

  if (applicant) {
    return await prisma.applicant.update({
      where: { id: applicant.id },
      data: { status: 'accepted' }, // Update the status to accepted
    });
  }

  throw new Error("applicant not found for this applicant and job posting");
};

// Reject an applicant (update their applicant status)
export const rejectApplicant = async (applicantId: number, jobId: number) => {
  const applicant = await prisma.applicant.findFirst({
    where: {
      id: applicantId,
      job_posting_id: jobId,
    },
  });

  if (applicant) {
    return await prisma.applicant.update({
      where: { id: applicant.id },
      data: { status: 'rejected' }, // Update the status to rejected
    });
  }

  throw new Error("applicant not found for this applicant and job posting");
};

// Mark an applicant as in process (update their applicant status)
export const inProcessApplicant = async (applicantId: number, jobId: number) => {

  const applicant = await prisma.applicant.findFirst({
    where: {
      id: applicantId,
      job_posting_id: jobId,
    },
  });

  if (applicant) {
    return await prisma.applicant.update({
      where: { id: applicant.id },
      data: { status: 'in_process' }, // Update the status to in process
    });
  }

  throw new Error("applicant not found for this applicant and job posting");
};

// Interview an applicant (update their applicant status)
export const interviewApplicant = async (applicantId: number, jobId: number) => {
  const applicant = await prisma.applicant.findFirst({
    where: {
      id: applicantId,
      job_posting_id: jobId,
    },
  });

  if (applicant) {
    return await prisma.applicant.update({
      where: { id: applicant.id },
      data: { status: 'interview' }, // Update the status to interview
    });
  }

  throw new Error("applicant not found for this applicant and job posting");
};



// Fetch test results for all applicants
export const getApplicantTestResults = async () => {
  return await prisma.result.findMany({
    include: { applicant: true },
  });
};


export const checkApplicant = async (userId: number, testId: string) => { 
  // get jobId from testId
  const job = await prisma.test.findUnique({
    where: { id: Number(testId) },
    select: { job_id: true },
  })

  if (!job) {
    throw new Error("Job not found");
  }

  // check if user has already applied for this job
  const existingApplicant = await prisma.applicant.findFirst({
    where: { job_posting_id: job.job_id, user_id: Number(userId) },
  });

  return existingApplicant
}

export const createApplicant = async (userId: number, jobId: string) => {
  // get job using jobId
  const job = await prisma.job.findUnique({
    where: { id: Number(jobId) },
  })

  if (!job) {
    throw new Error("Job not found");
  }

  // check if user has already applied for this job
  const existingApplicant = await prisma.applicant.findFirst({
    where: { job_posting_id: job.id, user_id: Number(userId) },
  });

  if (existingApplicant) {
    throw new Error("User has already applied for this job");
  }

  const data = {
    job_posting_id: job.id,
    user_id: Number(userId),
    applied_at: new Date(),
  }

  return await prisma.applicant.create({ data });
};
