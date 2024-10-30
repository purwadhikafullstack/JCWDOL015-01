// import { Request, Response } from 'express';
// import { createPreSelectionTest } from '@/service/test.service';
// import prisma from '@/prisma';

// export class TestController {
//     async createPreSelectionTest(req: Request, res: Response) {
//         try {
//             await createPreSelectionTest(req, res); // Call the service directly
//         } catch (error) {
//             return res.status(500).json({ message: 'Failed to create pre-selection test.', error: error.message });
//         }
//     }

//     async updatePreSelectionTest(req: Request, res: Response) {
//         const { testId } = req.params;
//         const { test_name, job_id } = req.body;
    
//         // Check if testId exists
//         if (!testId || (!test_name && !job_id)) {
//             return res.status(400).json({ message: 'Test ID is required and at least one field to update.' });
//         }
    
//         // Convert testId to number
//         const parsedTestId = parseInt(testId, 10);
    
//         // Check if parsedTestId is a valid number
//         if (isNaN(parsedTestId)) {
//             return res.status(400).json({ message: 'Invalid Test ID format.' });
//         }
    
//         try {
//             const updatedTest = await prisma.test.update({
//                 where: { id: parsedTestId }, // Use the parsed number here
//                 data: {
//                     ...(test_name && { title: test_name }), 
//                     ...(job_id && { job_id: job_id }), 
//                     updated_at: new Date(), 
//                 },
//             });
    
//             return res.status(200).json(updatedTest);
//         } catch (error) {
//             console.error(error);
//             return res.status(500).json({ message: 'Failed to update test.' });
//         }
//     }
    
//     async linkTestToJobApplication(req: Request, res: Response) {
//         const { jobId, testId } = req.body;

//         if (!jobId || !testId) {
//             return res.status(400).json({ message: 'Job ID and Test ID are required.' });
//         }

//         const updatedJob = await prisma.job.update({
//             where: { id: jobId },
//             data: {
//                 test: { connect: { id: testId } }, // Assuming you're connecting the test to the job
//             },
//         });

//         return res.status(200).json(updatedJob);
//     }

//     async submitPreSelectionTest(req: Request, res: Response) {
//         const { applicantId, testId, score } = req.body;

//         if (!applicantId || !testId || score === undefined) {
//             return res.status(400).json({ message: 'Applicant ID, Test ID, and Score are required.' });
//         }

//         const submittedTest = await prisma.result.create({
//             data: {
//                 applicant_id: applicantId, 
//                 test_id: testId, 
//                 score: score,
//                 completed_at: new Date(), 
//             },
//         });

//         return res.status(201).json(submittedTest);
//     }

//     async getTestResults(req: Request, res: Response) {
//         const { testId } = req.params;
    
//         // Convert testId to a number
//         const parsedTestId = parseInt(testId, 10);
    
//         // Check if parsedTestId is a valid number
//         if (isNaN(parsedTestId)) {
//             return res.status(400).json({ message: 'Invalid Test ID format.' });
//         }
    
//         try {
//             const results = await prisma.result.findMany({
//                 where: { test_id: parsedTestId }, // Use the parsed number here
//                 include: { applicant: true }, 
//             });
    
//             return res.status(200).json(results);
//         } catch (error) {
//             console.error(error);
//             return res.status(500).json({ message: 'Failed to retrieve test results.' });
//         }
//     }
    

//     async getTestsByJobId(req: Request, res: Response) {
//         const { jobId } = req.params;
    
//         // Check if jobId is provided
//         if (!jobId) {
//             return res.status(400).json({ message: 'Job ID is required.' });
//         }
    
//         // Convert jobId to a number
//         const parsedJobId = parseInt(jobId, 10);
    
//         // Check if parsedJobId is a valid number
//         if (isNaN(parsedJobId)) {
//             return res.status(400).json({ message: 'Invalid Job ID format.' });
//         }
    
//         try {
//             const tests = await prisma.test.findMany({
//                 where: { job_id: parsedJobId }, // Use the parsed number here
//             });
    
//             return res.status(200).json(tests);
//         } catch (error) {
//             console.error(error);
//             return res.status(500).json({ message: 'Failed to retrieve tests.' });
//         }
//     }
// }
// import { Request, Response } from 'express';
// import { createPreSelectionTest } from '@/service/test.service';
// import prisma from '@/prisma';

// export class TestController {
//     async createPreSelectionTest(req: Request, res: Response): Promise<Response> {
//         try {
//             await createPreSelectionTest(req, res);
//             return res.status(201).json({ message: 'Test created successfully' }); 
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 return res.status(500).json({ message: 'Failed to create pre-selection test.', error: error.message });
//             } else {
//                 return res.status(500).json({ message: 'An unknown error occurred.' });
//             }
//         }
//     }

//     async updatePreSelectionTest(req: Request, res: Response): Promise<Response> {
//         const { testId } = req.params;
//         const { test_name, job_id } = req.body;

//         if (!testId || (!test_name && !job_id)) {
//             return res.status(400).json({ message: 'Test ID is required and at least one field to update.' });
//         }

//         const parsedTestId = parseInt(testId, 10);
//         if (isNaN(parsedTestId)) {
//             return res.status(400).json({ message: 'Invalid Test ID format.' });
//         }

//         try {
//             const updatedTest = await prisma.test.update({
//                 where: { id: parsedTestId },
//                 data: {
//                     ...(test_name && { title: test_name }),
//                     ...(job_id && { job_id: job_id }),
//                     updated_at: new Date(),
//                 },
//             });

//             return res.status(200).json(updatedTest);
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 return res.status(500).json({ message: 'Failed to update test.', error: error.message });
//             } else {
//                 return res.status(500).json({ message: 'An unknown error occurred.' });
//             }
//         }
//     }

//     // Implement similar error handling for the other methods
//     async linkTestToJobApplication(req: Request, res: Response): Promise<Response> {
//         const { jobId, testId } = req.body;

//         if (!jobId || !testId) {
//             return res.status(400).json({ message: 'Job ID and Test ID are required.' });
//         }

//         try {
//             const updatedJob = await prisma.job.update({
//                 where: { id: jobId },
//                 data: {
//                     test: { connect: { id: testId } },
//                 },
//             });
//             return res.status(200).json(updatedJob);
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 return res.status(500).json({ message: 'Failed to link test to job application.', error: error.message });
//             } else {
//                 return res.status(500).json({ message: 'An unknown error occurred.' });
//             }
//         }
//     }

//     async submitPreSelectionTest(req: Request, res: Response): Promise<Response> {
//         const { applicantId, testId, score } = req.body;

//         if (!applicantId || !testId || score === undefined) {
//             return res.status(400).json({ message: 'Applicant ID, Test ID, and Score are required.' });
//         }

//         try {
//             const submittedTest = await prisma.result.create({
//                 data: {
//                     applicant_id: applicantId,
//                     test_id: testId,
//                     score: score,
//                     completed_at: new Date(),
//                 },
//             });

//             return res.status(201).json(submittedTest);
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 return res.status(500).json({ message: 'Failed to submit test.', error: error.message });
//             } else {
//                 return res.status(500).json({ message: 'An unknown error occurred.' });
//             }
//         }
//     }

//     async getTestResults(req: Request, res: Response): Promise<Response> {
//         const { testId } = req.params;
//         const parsedTestId = parseInt(testId, 10);

//         if (isNaN(parsedTestId)) {
//             return res.status(400).json({ message: 'Invalid Test ID format.' });
//         }

//         try {
//             const results = await prisma.result.findMany({
//                 where: { test_id: parsedTestId },
//                 include: { applicant: true },
//             });

//             return res.status(200).json(results);
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 return res.status(500).json({ message: 'Failed to retrieve test results.', error: error.message });
//             } else {
//                 return res.status(500).json({ message: 'An unknown error occurred.' });
//             }
//         }
//     }

//     async getTestsByJobId(req: Request, res: Response): Promise<Response> {
//         const { jobId } = req.params;

//         if (!jobId) {
//             return res.status(400).json({ message: 'Job ID is required.' });
//         }

//         const parsedJobId = parseInt(jobId, 10);
//         if (isNaN(parsedJobId)) {
//             return res.status(400).json({ message: 'Invalid Job ID format.' });
//         }

//         try {
//             const tests = await prisma.test.findMany({
//                 where: { job_id: parsedJobId },
//             });

//             return res.status(200).json(tests);
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 return res.status(500).json({ message: 'Failed to retrieve tests.', error: error.message });
//             } else {
//                 return res.status(500).json({ message: 'An unknown error occurred.' });
//             }
//         }
//     }
// }

import { Request, Response } from 'express';
import {createPreSelectionTest, updatePreSelectionTest, linkTestToJobApplication, submitPreSelectionTest, getTestResults, getTestsByJobId} from '@/service/test.service';

export class TestController {
    async createPreSelectionTest(req: Request, res: Response) {
        try {
            // Call the service function to create the pre-selection test
            const test = await createPreSelectionTest(req.body);
            // Return a 201 status with the created test data
            return res.status(201).json(test);
        } catch (error: unknown) {
            // Error handling
            if (error instanceof Error) {
                return res.status(500).json({ message: 'Failed to create pre-selection test.', error: error.message });
            }
            return res.status(500).json({ message: 'Failed to create pre-selection test.', error: 'Unknown error' });
        }
    }

    async updatePreSelectionTest(req: Request, res: Response) {
        const { testId } = req.params;
        const updateData = req.body;

        try {
            const updatedTest = await updatePreSelectionTest(Number(testId), updateData);
            return res.status(200).json(updatedTest);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({ message: 'Failed to update pre-selection test.', error: error.message });
            }
            return res.status(500).json({ message: 'Failed to update pre-selection test.', error: 'Unknown error' });
        }
    }

    async linkTestToJobApplication(req: Request, res: Response) {
        const { jobId, testId } = req.body;

        if (!jobId || !testId) {
            return res.status(400).json({ message: 'Job ID and Test ID are required.' });
        }

        try {
            const updatedJob = await linkTestToJobApplication(jobId, testId);
            return res.status(200).json(updatedJob);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({ message: 'Failed to link test to job application.', error: error.message });
            }
            return res.status(500).json({ message: 'Failed to link test to job application.', error: 'Unknown error' });
        }
    }

    async submitPreSelectionTest(req: Request, res: Response) {
        const { applicantId, testId, score } = req.body;

        if (!applicantId || !testId || score === undefined) {
            return res.status(400).json({ message: 'Applicant ID, Test ID, and Score are required.' });
        }

        try {
            const submittedTest = await submitPreSelectionTest(applicantId, testId, score);
            return res.status(201).json(submittedTest);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({ message: 'Failed to submit pre-selection test.', error: error.message });
            }
            return res.status(500).json({ message: 'Failed to submit pre-selection test.', error: 'Unknown error' });
        }
    }

    async getTestResults(req: Request, res: Response) {
        const { testId } = req.params;

        try {
            const results = await getTestResults(Number(testId));
            return res.status(200).json(results);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({ message: 'Failed to retrieve test results.', error: error.message });
            }
            return res.status(500).json({ message: 'Failed to retrieve test results.', error: 'Unknown error' });
        }
    }

    async getTestsByJobId(req: Request, res: Response) {
        const { jobId } = req.params;

        try {
            const tests = await getTestsByJobId(Number(jobId));
            return res.status(200).json(tests);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({ message: 'Failed to retrieve tests.', error: error.message });
            }
            return res.status(500).json({ message: 'Failed to retrieve tests.', error: 'Unknown error' });
        }
    }
}
