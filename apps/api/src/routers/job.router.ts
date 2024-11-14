import { Router } from 'express';
import { JobController } from '@/controllers/job.controller';
import multer from 'multer'; // Import multer

// Create a router instance
const router = Router();
const jobController = new JobController();

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Set destination for uploaded files

// Route for creating a job posting
router.post('/', upload.single('banner'), jobController.createJobPosting.bind(jobController)); // Use multer to handle file upload

// Route for updating a job posting
router.put('/:id', upload.single('banner'), jobController.updateJobPosting.bind(jobController)); // Use multer for updating

// Route for deleting a job posting
router.delete('/:id', jobController.deleteJobPosting.bind(jobController));

// Route for toggling publish status of a job posting
router.patch('/:id/publish', jobController.toggleJobPublishStatus.bind(jobController));

// Route for getting all job postings
router.get('/', jobController.getJobPostings.bind(jobController));

// Route for getting details of a specific job posting
router.get('/:id', jobController.getJobPostingDetail.bind(jobController));

// Route for getting test job posting
router.get('/:id/test', jobController.getJobPostingTest.bind(jobController));

// Export the router to use in your main app file
export default router;
