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
            // compare existing questions length and updateData questions length
            const existingQuestions = await testService.getQuestionsByTestId(testId);
            if (updateData.questions.length !== 0 && updateData.questions.length !== existingQuestions?.questions.length) {
                res.status(400).json({ message: 'Jumlah pertanyaan tidak sama dengan sebelumnya' });
                return
            }

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

    public async deleteTest(req: Request, res: Response): Promise<void> {
        try {
            const testId = parseInt(req.params.testId, 10);
            const test = await testService.deleteTest(testId);
            if (test) {
                res.status(200).json({ message: 'Test successfully deleted' });
            } else {
                res.status(404).json({ message: 'Test not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting test', error });
        }
    }
}