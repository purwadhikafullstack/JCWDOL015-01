import { Router } from 'express';
import { 
  getAllApplicantsController, 
  getApplicantsByJobPostingController, 
  getApplicantByIdController, 
  acceptApplicantController, 
  rejectApplicantController, 
  fetchApplicantTestResultsController, 
  inProcessApplicantController,
  interviewApplicantController
} from '@/controllers/applicant.controller';

const router = Router();

// Route to get all applicants
router.get('/', getAllApplicantsController);

// Route to get applicants by job posting ID with optional filters
router.get('/job-postings/:jobId/applicants', getApplicantsByJobPostingController);

// Route to get a single applicant by ID
router.get('/:id', getApplicantByIdController);

// Route to accept an applicant
router.put('/:id/accept/:jobId', acceptApplicantController);

// Route to reject an applicant
router.put('/:id/reject/:jobId', rejectApplicantController);

// Route to in_proccess an applicant
router.put('/:id/in_process/:jobId', inProcessApplicantController);

// Route to interview an applicant
router.put('/:id/interview/:jobId', interviewApplicantController);

// Route to fetch applicant test results
router.get('/test-results', fetchApplicantTestResultsController);

export default router;
