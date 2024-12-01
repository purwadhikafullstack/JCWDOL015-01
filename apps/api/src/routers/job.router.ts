import { JobController } from '@/controllers/job.controller';
import { Router } from 'express';

export class JobRouter {
  private router: Router;
  private jobController: JobController;

  constructor() {
    this.jobController = new JobController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.jobController.getJobs);
    this.router.post('/:jobId/apply', this.jobController.jobApplication);
    this.router.get('/:jobId/application', this.jobController.displayJob);
  }

  getRouter(): Router {
    return this.router;
  }
}
