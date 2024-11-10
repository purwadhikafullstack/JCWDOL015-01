import { PrismaClient, ApplicationStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class ApplicationsService {
  public async getApplicationsByStatus(status: ApplicationStatus): Promise<any[]> {
    try {
      const applications = await prisma.application.findMany({
        where: { status },
        include: { user: true }, // Adjust as needed for relations
      });
      return applications;
    } catch (error) {
      console.error('Error fetching applications by status:', error);
      throw new Error('Could not fetch applications');
    }
  }
}
