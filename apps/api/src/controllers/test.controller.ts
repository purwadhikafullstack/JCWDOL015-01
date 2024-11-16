// import { Request, Response } from 'express';
// import {createPreSelectionTest, updatePreSelectionTest, linkTestToJobApplication, submitPreSelectionTest, getTestResults, getTestsByJobId} from '@/services/test.service';

import prisma from "@/prisma";

// export class TestController {
//     async createPreSelectionTest(req: Request, res: Response) {
//         try {
//             // Call the service function to create the pre-selection test
//             const test = await createPreSelectionTest(req.body);
//             // Return a 201 status with the created test data
//             return res.status(201).json(test);
//         } catch (error: unknown) {
//             // Error handling
//             if (error instanceof Error) {
//                 return res.status(500).json({ message: 'Failed to create pre-selection test.', error: error.message });
//             }
//             return res.status(500).json({ message: 'Failed to create pre-selection test.', error: 'Unknown error' });
//         }
//     }

//     async updatePreSelectionTest(req: Request, res: Response) {
//         const { testId } = req.params;
//         const updateData = req.body;

//         try {
//             const updatedTest = await updatePreSelectionTest(Number(testId), updateData);
//             return res.status(200).json(updatedTest);
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 return res.status(500).json({ message: 'Failed to update pre-selection test.', error: error.message });
//             }
//             return res.status(500).json({ message: 'Failed to update pre-selection test.', error: 'Unknown error' });
//         }
//     }

//     async linkTestToJobApplication(req: Request, res: Response) {
//         const { jobId, testId } = req.body;

//         if (!jobId || !testId) {
//             return res.status(400).json({ message: 'Job ID and Test ID are required.' });
//         }

//         try {
//             const updatedJob = await linkTestToJobApplication(jobId, testId);
//             return res.status(200).json(updatedJob);
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 return res.status(500).json({ message: 'Failed to link test to job application.', error: error.message });
//             }
//             return res.status(500).json({ message: 'Failed to link test to job application.', error: 'Unknown error' });
//         }
//     }

//     async submitPreSelectionTest(req: Request, res: Response) {
//         const { applicantId, testId, score } = req.body;

//         if (!applicantId || !testId || score === undefined) {
//             return res.status(400).json({ message: 'Applicant ID, Test ID, and Score are required.' });
//         }

//         try {
//             const submittedTest = await submitPreSelectionTest(applicantId, testId, score);
//             return res.status(201).json(submittedTest);
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 return res.status(500).json({ message: 'Failed to submit pre-selection test.', error: error.message });
//             }
//             return res.status(500).json({ message: 'Failed to submit pre-selection test.', error: 'Unknown error' });
//         }
//     }

//     async getTestResults(req: Request, res: Response) {
//         const { testId } = req.params;

//         try {
//             const results = await getTestResults(Number(testId));
//             return res.status(200).json(results);
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 return res.status(500).json({ message: 'Failed to retrieve test results.', error: error.message });
//             }
//             return res.status(500).json({ message: 'Failed to retrieve test results.', error: 'Unknown error' });
//         }
//     }

//     async getTestsByJobId(req: Request, res: Response) {
//         const { jobId } = req.params;

//         try {
//             const tests = await getTestsByJobId(Number(jobId));
//             return res.status(200).json(tests);
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 return res.status(500).json({ message: 'Failed to retrieve tests.', error: error.message });
//             }
//             return res.status(500).json({ message: 'Failed to retrieve tests.', error: 'Unknown error' });
//         }
//     }
// }


import { Request, Response } from 'express';
import * as testService from '@/services/test.service';
import { checkApplicant, createApplicant } from "@/services/applicant.service";

export class TestController {
    public async createPreSelectionTest(req: Request, res: Response): Promise<void> {
        try {
            const testData = req.body;
            const newTest = await testService.createPreSelectionTest(testData);
            res.status(201).json(newTest);
        } catch (error) {
            res.status(500).json({ message: 'Error creating test', error });
        }
    }

    public async updatePreSelectionTest(req: Request, res: Response): Promise<void> {
        try {
            const testId = parseInt(req.params.testId, 10);
            const updateData = req.body;
            const updatedTest = await testService.updatePreSelectionTest(testId, updateData);
            res.status(200).json(updatedTest);
        } catch (error) {
            res.status(500).json({ message: 'Error updating test', error });
        }
    }

    public async linkTestToJobApplication(req: Request, res: Response): Promise<void> {
        try {
            const { jobId, testId } = req.body;
            const linkedTest = await testService.linkTestToJobApplication(jobId, testId);
            res.status(200).json(linkedTest);
        } catch (error) {
            res.status(500).json({ message: 'Error linking test to job application', error });
        }
    }

    public async submitPreSelectionTest(req: Request, res: Response): Promise<void> {
        const job = await testService.getJobByTestId(Number(req.params.testId));

        if(!job) {
            res.status(404).json({ message: 'Job not found' });
            return
        }
            

        // check if user already applied
        if (job?.id) {
            const existingApplicants = await checkApplicant(req.body.userId, req.params.testId);
            if (existingApplicants !== null) {
                res.status(400).json({ message: 'User already applied for this job' });
                return
            }
        }

        try {
            const applicant = await createApplicant(req.body.userId, job.id.toString());
            const result = await testService.submitPreSelectionTest(req.body, req.params.testId, applicant.id);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error submitting test', error });
        }
    
    }

    public async getTestResults(req: Request, res: Response): Promise<void> {
        try {
            const testId = parseInt(req.params.testId, 10);
            const results = await testService.getTestResults(testId);
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving test results', error });
        }
    }

    // New function to get a test by ID
    public async getTestById(req: Request, res: Response): Promise<void> {
        try {
            const testId = parseInt(req.params.testId, 10);
            const test = await testService.getTestById(testId);
            if (test) {
                res.status(200).json(test);
            } else {
                res.status(404).json({ message: 'Test not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving test', error });
        }
    }
}

// // CREATE TEST WITH QUESTION AND CHOICE
// import { Request, Response } from 'express';
// import { createTestWithQuestions } from '../services/test.service';

// export async function createTest(req: Request, res: Response) {
//   try {
//     const data = req.body;  // Get the data from the request body
//     const createdTest = await createTestWithQuestions(data);  // Call the service function

//     // Send success response with the test ID
//     return res.status(201).json({
//       message: 'Test created successfully',
//       test_id: createdTest.id,  // Return the created test's ID
//     });
//   } catch (error: unknown) {  // Specify the error type
//     // Check if the error is an instance of Error
//     if (error instanceof Error) {
//       console.error(error.message);  // Access the error message
//       return res.status(500).json({
//         message: 'Failed to create test',
//         error: error.message,  // Access the message of the error
//       });
//     }

//     // If the error is not an instance of Error, return a generic message
//     return res.status(500).json({
//       message: 'Failed to create test',
//       error: 'An unknown error occurred',  // Fallback error message
//     });
//   }
// }
