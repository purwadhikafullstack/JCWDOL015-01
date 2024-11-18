import { Request, Response } from 'express';
import prisma from '@/prisma';
import { InterviewSchedule, InterviewStatus } from '@prisma/client';
import { createSchedule as createScheduleService, getSchedules as getSchedulesService, getSchedulesById as getSchedulesByIdService, updateSchedule as updateScheduleService, deleteSchedule as deleteScheduleService, sendEmailNotification, getSchedulesById } from '@/services/interview.service';

export class InterviewController {
  async createSchedule(req: Request, res: Response) {
    const { applicant, date_time, location, status }: {
      applicant: number;
      date_time: Date;
      location: string;
      status: InterviewStatus;
    } = req.body;

    try {
      const schedule = await createScheduleService({ applicant_id : applicant, date_time, location, status });
      return res.status(201).json(schedule);
    } catch (error: unknown) {
      console.error(error);
      return res.status(500).json({
        message: 'Gagal membuat jadwal wawancara.',
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
        message: 'Gagal mengambil jadwal wawancara.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getSchedulesById(req: Request, res: Response) {
    try {
      const schedules = await getSchedulesByIdService(Number(req.params.id));
      return res.status(200).json(schedules);
    } catch (error: unknown) {
      console.error(error);
      return res.status(500).json({
        message: 'Gagal mengambil jadwal wawancara.',
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
        message: 'Gagal memperbarui jadwal wawancara.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async deleteSchedule(req: Request, res: Response) {
    const { id } = req.params;

    // Check if the schedule exists
    const schedule = await prisma.interviewSchedule.findUnique({
      where: { id: Number(id) },
    });

    if (!schedule) {
      return res.status(404).json({ message: 'Jadwal wawancara tidak ditemukan.' });
    }

    try {
      await deleteScheduleService(Number(id));
      return res.status(200).json({ message: 'Jadwal wawancara berhasil dihapus.' });
    } catch (error: unknown) {
      console.error(error);
      return res.status(500).json({
        message: 'Gagal menghapus jadwal wawancara.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
