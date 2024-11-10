// import { Request, Response } from 'express';
// import prisma from '@/prisma';
// import { InterviewSchedule, InterviewStatus } from '@prisma/client';

// export class InterviewController {
//   async createSchedule(req: Request, res: Response) {
//     const { application_id, date_time, location, status }: {
//       application_id: number;
//       date_time: Date;
//       location: string;
//       status: InterviewStatus;
//     } = req.body;

//     try {
//       const schedule = await prisma.interviewSchedule.create({
//         data: {
//           application_id,
//           date_time,
//           location,
//           status,
//         },
//       });

//       // Send email notification to the applicant
//       await this.sendEmailNotification(schedule.application_id);

//       return res.status(201).json(schedule);
//     } catch (error: unknown) {
//       return res.status(500).json({
//         message: 'Failed to create interview schedule.',
//         error: error instanceof Error ? error.message : 'Unknown error',
//       });
//     }
//   }

//   async getSchedules(req: Request, res: Response) {
//     try {
//       const schedules = await prisma.interviewSchedule.findMany({
//         include: {
//           application: {
//             include: {
//               user: true, // Include user details if needed
//             },
//           },
//         },
//       });
//       return res.status(200).json(schedules);
//     } catch (error: unknown) {
//       return res.status(500).json({
//         message: 'Failed to fetch interview schedules.',
//         error: error instanceof Error ? error.message : 'Unknown error',
//       });
//     }
//   }

//   async updateSchedule(req: Request, res: Response) {
//     const { id } = req.params;
//     const { date_time, location, status }: Partial<{
//       date_time: Date;
//       location: string;
//       status: InterviewStatus;
//     }> = req.body;

//     try {
//       const updatedSchedule = await prisma.interviewSchedule.update({
//         where: { id: Number(id) },
//         data: {
//           ...(date_time && { date_time }),
//           ...(location && { location }),
//           ...(status && { status }),
//         },
//       });

//       return res.status(200).json(updatedSchedule);
//     } catch (error: unknown) {
//       return res.status(500).json({
//         message: 'Failed to update interview schedule.',
//         error: error instanceof Error ? error.message : 'Unknown error',
//       });
//     }
//   }

//   async deleteSchedule(req: Request, res: Response) {
//     const { id } = req.params;

//     try {
//       await prisma.interviewSchedule.delete({ where: { id: Number(id) } });
//       return res.status(204).send();
//     } catch (error: unknown) {
//       return res.status(500).json({
//         message: 'Failed to delete interview schedule.',
//         error: error instanceof Error ? error.message : 'Unknown error',
//       });
//     }
//   }

//   // Email Notification function (implement this function based on your email service)
//   private async sendEmailNotification(applicationId: number) {
//     const application = await prisma.application.findUnique({
//       where: { id: applicationId },
//       include: { user: true },
//     });

//     if (application && application.user) {
//       // Use nodemailer or any email service to send the notification
//       // Example:
//       // await emailService.sendInterviewNotification(application.user.email, application);
//     }
//   }
// }

import { Request, Response } from 'express';
import prisma from '@/prisma';
import { InterviewSchedule, InterviewStatus } from '@prisma/client';
import { createSchedule as createScheduleService, getSchedules as getSchedulesService, updateSchedule as updateScheduleService, deleteSchedule as deleteScheduleService, sendEmailNotification } from '@/services/interview.service';

export class InterviewController {
  async createSchedule(req: Request, res: Response) {
    const { application_id, date_time, location, status }: {
      application_id: number;
      date_time: Date;
      location: string;
      status: InterviewStatus;
    } = req.body;

    try {
      const schedule = await createScheduleService({ application_id, date_time, location, status });
      return res.status(201).json(schedule);
    } catch (error: unknown) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to create interview schedule.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getSchedules(req: Request, res: Response) {
    try {
      const schedules = await getSchedulesService();
      return res.status(200).json(schedules);
    } catch (error: unknown) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch interview schedules.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async updateSchedule(req: Request, res: Response) {
    const { id } = req.params;
    const { date_time, location, status }: Partial<{
      date_time: Date;
      location: string;
      status: InterviewStatus;
    }> = req.body;

    try {
      const updatedSchedule = await updateScheduleService(Number(id), { date_time, location, status });
      return res.status(200).json(updatedSchedule);
    } catch (error: unknown) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to update interview schedule.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async deleteSchedule(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await deleteScheduleService(Number(id));
      return res.status(204).send();
    } catch (error: unknown) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to delete interview schedule.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
