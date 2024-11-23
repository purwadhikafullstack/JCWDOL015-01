import { Router, Request, Response } from 'express';
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

export class ApplicantRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get('/', getAllApplicantsController);
    this.router.get('/job-postings/:jobId/applicants', getApplicantsByJobPostingController);
    this.router.get('/:id', getApplicantByIdController);
    this.router.put('/:id/accept/:jobId', acceptApplicantController);
    this.router.put('/:id/reject/:jobId', rejectApplicantController);
    this.router.put('/:id/in_process/:jobId', inProcessApplicantController);
    this.router.put('/:id/interview/:jobId', interviewApplicantController);
    this.router.get('/test-results', fetchApplicantTestResultsController);
  }

  public getRouter(): Router {
    return this.router;
  }
}
