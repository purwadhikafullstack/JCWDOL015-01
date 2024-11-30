import { JobController } from '@/controllers/job.controller';
import { Router } from 'express';
import path from 'path';
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
    // Set destination for uploaded files
    // Configure storage engine and filename
    const storage = multer.diskStorage({
      destination: '../web/public/uploads/',
      filename: function (req, file, cb) {
        cb(
          null,
          file.fieldname + '-' + Date.now() + path.extname(file.originalname),
        );
      },
    });

    const upload = multer({
      storage: storage,
      limits: { fileSize: 1000000 },
      // fileFilter: function (req, file, cb) {
      //   checkFileType(file, cb);
      // }
    });

    // // Check file type
    // function checkFileType(file: Express.Multer.File, cb : multer.FileFilterCallback) {
    //   const filetypes = /jpeg|jpg|png|gif/;
    //   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //   const mimetype = filetypes.test(file.mimetype);

    //   if (mimetype && extname) {
    //     return cb(null, true);
    //   } else {
    //     cb(new Error('Error: Images only! (jpeg, jpg, png, gif)'));
    //   }
    // }

    // Route for creating a job posting
    this.router.post(
      '/',
      upload.single('banner'),
      this.jobController.createJobPosting,
    ); // Use multer to handle file upload

    // Route for updating a job posting
    this.router.put(
      '/:id',
      upload.single('banner'),
      this.jobController.updateJobPosting,
    ); // Use multer for updating

    // Route for deleting a job posting
    this.router.delete('/:id', this.jobController.deleteJobPosting);

    // Route for toggling publish status of a job posting
    this.router.patch(
      '/:id/publish',
      this.jobController.toggleJobPublishStatus,
    );

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
