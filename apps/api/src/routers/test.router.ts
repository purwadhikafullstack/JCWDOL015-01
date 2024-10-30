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
        // this.router.post('/tests', checkAdmin, this.testController.createPreSelectionTest);
        this.router.post('/tests', this.testController.createPreSelectionTest);

        // Route for editing a pre-selection test (admin only)
        this.router.patch('/tests/:testId', checkAdmin, this.testController.updatePreSelectionTest);

        // Route for linking a test to a job application (can be accessed by all)
        this.router.put('/tests/link', this.testController.linkTestToJobApplication);

        // Route for submitting a pre-selection test (can be accessed by all)
        this.router.post('/tests/submit', this.testController.submitPreSelectionTest);

        // Route for getting test results (can be accessed by all)
        this.router.get('/tests/:testId/results', this.testController.getTestResults);
    }

    public getRouter(): Router { 
        return this.router;
    }
}
