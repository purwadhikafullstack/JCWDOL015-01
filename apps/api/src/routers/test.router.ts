import { TestController } from '@/controllers/test.controller';
import { Router } from 'express';
import { checkAdmin } from '@/middlewares/checkAdmin';

export class TestRouter {
    private router: Router;
    private testController: TestController;

    constructor() {
        this.testController = new TestController();
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Route for creating a pre-selection test (admin only)
        this.router.post('/', checkAdmin, this.testController.createPreSelectionTest);

        // Route for editing a pre-selection test (admin only)
        this.router.patch('/:testId', checkAdmin, this.testController.updatePreSelectionTest);

        // Route for linking a test to a job application (can be accessed by all)
        this.router.put('/link', this.testController.linkTestToJobApplication);

        // Route for submitting a pre-selection test (can be accessed by all)
        this.router.post('/:testId/submit', this.testController.submitPreSelectionTest);

        // Route for getting a specific test by ID (can be accessed by all)
        this.router.get('/:testId', this.testController.getTestById);

        // Route for getting test results (can be accessed by all)
        this.router.get('/:testId/results', this.testController.getTestResults);

        // Route for updating a pre-selection test (admin only)
        this.router.put('/:testId', checkAdmin, this.testController.updatePreSelectionTest);

        // Route for deleting a pre-selection test (admin only)
        this.router.delete('/:testId', checkAdmin, this.testController.deleteTest);
    }

    public getRouter(): Router { 
        return this.router;
    }
}

// // CREATE TEST WITH QUESTION AND CHOICE
// import express from 'express';
// import { createTest } from '../controllers/test.controller';  // Use the correct controller function

// const router = express.Router();

// router.post('/createWithQuestions', createTest);  // Use the createTest controller

// export default router;
