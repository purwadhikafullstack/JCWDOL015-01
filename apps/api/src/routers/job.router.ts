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
    this.router.get('/', this.jobController.getAllJobs);
    this.router.get('/locations', this.jobController.getJobLocations);
    this.router.get('/geolocation', this.jobController.getJobsByGeolocation);
    this.router.get('/filter', this.jobController.getJobsByFilter);
    this.router.post('/', this.jobController.addJob);
    this.router.post('/:id', this.jobController.updateJob);
    this.router.delete('/:id', this.jobController.deleteJob);
  }

  getRouter(): Router {
    return this.router;
  }
}
