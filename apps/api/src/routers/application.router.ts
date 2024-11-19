import { ApplicationController } from '@/controllers/application.controller';
import { Router } from 'express';

export class ApplicationRouter {
  private router: Router;
  private applicationController: ApplicationController;

  constructor() {
    this.applicationController = new ApplicationController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/apply', this.applicationController.applyJob);
    this.router.get('/details', this.applicationController.getJobDetail);
  }

  getRouter(): Router {
    return this.router;
  }
}
