import prisma from '@/prisma';
import { InterviewSchedule, InterviewStatus } from '@prisma/client';

// Input interface for creating a schedule
interface CreateScheduleInput {
  applicant_id: number;
  date_time: Date;
  location: string;
  status: InterviewStatus; // Use the enum type directly
}

// Function to create a new interview schedule
export const createSchedule = async (input: CreateScheduleInput): Promise<InterviewSchedule> => {
  const { applicant_id, date_time, location, status } = input;

  const schedule = await prisma.interviewSchedule.create({
    data: {
      applicant_id: applicant_id,
      date_time: new Date(date_time),
      location: location,
      status: status ?? 'SCHEDULED',
    },
  });

  // // Implement the email notification logic
  // await sendEmailNotification(schedule.applicant_id);

  return schedule;
};

// Function to retrieve all interview schedules
export const getSchedules = async (): Promise<InterviewSchedule[]> => {
  return await prisma.interviewSchedule.findMany({
    include: {
      applicant: {
        include: {
          user: true, // Include user details if needed
        },
      },
    },
  });
};

// Function to retrieve interview schedules by id
export const getSchedulesById = async (id: number): Promise<InterviewSchedule | null> => {
  return await prisma.interviewSchedule.findUnique({
    where: { id: id },
    include: {
      applicant: {
        include: {
          user: true, // Include user details if needed
        },
      },
    },
  });
};

// Function to update an existing interview schedule
export const updateSchedule = async (
  id: number,
  input: Partial<Omit<CreateScheduleInput, 'application_id'>>
): Promise<InterviewSchedule> => {
  if (input.date_time) {
    const newDate = input.date_time.toString().split('T')[0];
    const newTime = input.date_time.toString().split('T')[1];

    input.date_time = new Date(`${newDate}T${newTime}:00.000Z`);    
  }
  return await prisma.interviewSchedule.update({
    where: { id },
    data: {
      ...(input.date_time && { date_time: input.date_time }),
      ...(input.location && { location: input.location }),
      ...(input.status && { status: input.status as InterviewStatus }), // Cast to InterviewStatus
    },
  });
};

// Function to delete an interview schedule
export const deleteSchedule = async (id: number): Promise<void> => {
  await prisma.interviewSchedule.delete({ where: { id } });
};

// Email Notification function
export const sendEmailNotification = async (applicantId: number) => {
  // Fetch the applicant and associated user details
  const applicant = await prisma.applicant.findUnique({
    where: { id: applicantId },
    include: { user: true }, // Include user details
  });

  // Fetch the latest interview schedule for this applicant
  const interviewSchedule = await prisma.interviewSchedule.findFirst({
    where: { applicant_id: applicantId },
    orderBy: { date_time: 'asc' }, // Get the earliest scheduled interview
  });
  
  if (applicant && applicant.user && interviewSchedule) {
    const { date_time, location } = interviewSchedule; // Access interview details
  
    // Set up Nodemailer transporter
    const nodemailer = require('nodemailer');
    const emailService = nodemailer.createTransport({
      host: 'smtp.example.com', // Replace with your SMTP server
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'your-email@example.com', // Replace with your email
        pass: 'your-email-password', // Replace with your email password
      },
    });
  
    const subject = 'Interview Schedule Confirmation';
    const text = `Dear ${applicant.user.name},\n\nYou have an interview scheduled on ${date_time.toISOString()} at ${location}.\n\nBest regards,\nYour Team`;
  
    // Send the email notification
    await emailService.sendMail({
      to: applicant.user.email,
      subject,
      text,
    });
  } else {
    // Handle cases where applicant or interview schedule is not found
    console.error('Applicant or interview schedule not found for ID:', applicantId);
  }
};
