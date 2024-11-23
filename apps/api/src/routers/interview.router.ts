import { Router, Request, Response } from 'express';
import { InterviewController } from '@/controllers/interview.controller';

export class InterviewRouter {
  private router: Router;
  private interviewController: InterviewController;

  constructor() {
    this.router = Router();
    this.interviewController = new InterviewController();
    this.routes();
  }

  private routes(): void {
    // Create interview schedule (POST)
    this.router.post('/', this.interviewController.createSchedule);

    // Get interview schedules (GET)
    this.router.get('/', this.interviewController.getSchedules);

    // Get interview schedules (GET)
    this.router.get('/:id', this.interviewController.getSchedulesById);

    // Update interview schedule (PUT)
    this.router.put('/:id', this.interviewController.updateSchedule);

    // Delete interview schedule (DELETE)
    this.router.delete('/:id', this.interviewController.deleteSchedule);
  }

  public getRouter(): Router {
    return this.router;
  }
}
