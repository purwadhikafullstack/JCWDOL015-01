import { Request, Response } from 'express';
import { ApplicationsService } from '@/services/application.service';

export class ApplicationsController {
  private applicationsService = new ApplicationsService();

  public async getApplications(req: Request, res: Response): Promise<void> {
    try {
      const status = req.query.status as string; // Retrieve the status query parameter
      const applications = await this.applicationsService.getApplicationsByStatus(status);
      res.status(200).json(applications);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve applications' });
    }
  }
}
