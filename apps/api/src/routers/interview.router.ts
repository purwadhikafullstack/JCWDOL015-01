import express, { Request, Response, NextFunction } from 'express';
import { InterviewController } from '@/controllers/interview.controller';

const router = express.Router();
const interviewController = new InterviewController();

// Define routes and link to controller methods

// Middleware to handle async errors in controller
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Create interview schedule (POST)
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  await interviewController.createSchedule(req, res);
}));

// Get interview schedules (GET)
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  await interviewController.getSchedules(req, res);
}));

// Get interview schedules (GET)
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  await interviewController.getSchedulesById(req, res);
}));

// Update interview schedule (PUT)
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  await interviewController.updateSchedule(req, res);
}));

// Delete interview schedule (DELETE)
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  await interviewController.deleteSchedule(req, res);
}));

export default router;

