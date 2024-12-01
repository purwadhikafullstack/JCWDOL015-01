import { ApplicationController } from '@/controllers/application.controller';
import { cvUploader } from '@/middleware/uploader';
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
    this.router.post(
      '/submission',
      cvUploader('resume', '/resume').single('resume'),
      this.applicationController.submission,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
