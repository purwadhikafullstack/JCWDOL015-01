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

// // Accept an applicant (update their application status)
// export const acceptApplicant = async (applicantId: number, jobId: number) => {
//   const application = await prisma.application.findFirst({
//     where: {
//       user_id: applicantId,
//       job_id: jobId,
//     },
//   });

//   if (application) {
//     return await prisma.application.update({
//       where: { id: application.id },
//       data: { status: 'accepted' }, // Update the status to accepted
//     });
//   }

//   throw new Error("Application not found for this applicant and job posting");
// };

// // Reject an applicant (update their application status)
// export const rejectApplicant = async (applicantId: number, jobId: number) => {
//   const application = await prisma.application.findFirst({
//     where: {
//       user_id: applicantId,
//       job_id: jobId,
//     },
//   });

//   if (application) {
//     return await prisma.application.update({
//       where: { id: application.id },
//       data: { status: 'rejected' }, // Update the status to rejected
//     });
//   }

//   throw new Error("Application not found for this applicant and job posting");
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

//   return await prisma.application.findMany({
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

// // Accept an applicant (update their application status)
// export const acceptApplicant = async (applicantId: number, jobId: number) => {
//   const application = await prisma.application.findFirst({
//     where: {
//       user_id: applicantId,
//       job_id: jobId,
//     },
//   });

//   if (application) {
//     return await prisma.application.update({
//       where: { id: application.id },
//       data: { status: 'accepted' }, // Update the status to accepted
//     });
//   }

//   throw new Error("Application not found for this applicant and job posting");
// };

// // Reject an applicant (update their application status)
// export const rejectApplicant = async (applicantId: number, jobId: number) => {
//   const application = await prisma.application.findFirst({
//     where: {
//       user_id: applicantId,
//       job_id: jobId,
//     },
//   });

//   if (application) {
//     return await prisma.application.update({
//       where: { id: application.id },
//       data: { status: 'rejected' }, // Update the status to rejected
//     });
//   }

//   throw new Error("Application not found for this applicant and job posting");
// };

// // Fetch test results for all applicants
// export const getApplicantTestResults = async () => {
//   return await prisma.result.findMany({
//     include: { applicant: true },
//   });
// };

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch all applicants
export const getAllApplicants = async () => {
  return await prisma.applicant.findMany({
    include: { user: true, job: true }, // Include related user and job data if necessary
  });
};

// Fetch applicants by job posting ID with filtering
export const getApplicantsByJobPosting = async (jobId: number, filters: any) => {
  const { name, salary, education } = filters;

  return await prisma.application.findMany({
    where: {
      job_id: jobId,
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

// Accept an applicant (update their application status)
export const acceptApplicant = async (applicantId: number, jobId: number) => {
  const application = await prisma.application.findFirst({
    where: {
      user_id: applicantId,
      job_id: jobId,
    },
  });

  if (application) {
    return await prisma.application.update({
      where: { id: application.id },
      data: { status: 'accepted' }, // Update the status to accepted
    });
  }

  throw new Error("Application not found for this applicant and job posting");
};

// Reject an applicant (update their application status)
export const rejectApplicant = async (applicantId: number, jobId: number) => {
  const application = await prisma.application.findFirst({
    where: {
      user_id: applicantId,
      job_id: jobId,
    },
  });

  if (application) {
    return await prisma.application.update({
      where: { id: application.id },
      data: { status: 'rejected' }, // Update the status to rejected
    });
  }

  throw new Error("Application not found for this applicant and job posting");
};

// Fetch test results for all applicants
export const getApplicantTestResults = async () => {
  return await prisma.result.findMany({
    include: { applicant: true },
  });
};
