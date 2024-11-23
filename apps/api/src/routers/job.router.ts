import { JobController } from '@/controllers/job.controller';
import { Router } from 'express';
import multer from 'multer'; // Import multer

export class JobRouter {
  private router: Router;
  private jobController: JobController;

  constructor() {
    this.jobController = new JobController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Set up multer for file uploads
    const upload = multer({ dest: 'uploads/' }); // Set destination for uploaded files

    // Route for creating a job posting
    this.router.post('/', upload.single('banner'), this.jobController.createJobPosting); // Use multer to handle file upload

    // Route for updating a job posting
    this.router.put('/:id', upload.single('banner'), this.jobController.updateJobPosting); // Use multer for updating

    // Route for deleting a job posting
    this.router.delete('/:id', this.jobController.deleteJobPosting);

    // Route for toggling publish status of a job posting
    this.router.patch('/:id/publish', this.jobController.toggleJobPublishStatus);

    // Route for getting all job based on geolocation
    this.router.get('/geolocation', this.jobController.getJobsByGeolocation);

    this.router.get('/locations', this.jobController.getLocations);

    // Route for getting all job postings
    this.router.get('/', this.jobController.getJobPostings);

    // Route for getting details of a specific job posting
    this.router.get('/:id', this.jobController.getJobPostingDetail);

    // Route for getting test job posting
    this.router.get('/:id/test', this.jobController.getJobPostingTest);

    // Route for applying for a job
    this.router.post('/:id/apply', this.jobController.applyForJob);
  }

  getRouter(): Router {
    return this.router;
  }
}
