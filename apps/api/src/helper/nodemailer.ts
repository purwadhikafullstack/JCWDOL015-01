import { sign } from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import prisma from '@/prisma';
import cron from 'node-cron';
import { SubsStatus } from '@prisma/client';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendMailUser = async (userId: number, userEmail: string) => {
  try {
    const payload = { id: userId, email: userEmail };
    const token = sign(payload, process.env.JWT!, { expiresIn: '1h' });

    const templatePath = path.join(
      __dirname,
      '../templates/verificationMail.hbs',
    );
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = Handlebars.compile(templateSource);
    const html = compiledTemplate({
      link: `http://localhost:3000/verify/${token}`,
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: userEmail,
      subject: 'Email verification',
      html: html,
    });
  } catch (error) {
    throw new Error('Failed to send email');
  }
};

export const sendMailAdmin = async (adminEmail: string) => {
  try {
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: adminEmail },
    });

    const templatePath = path.join(__dirname, '../templates/welcomeAdmin.hbs');

    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = Handlebars.compile(templateSource);
    const html = compiledTemplate({
      companyName: existingAdmin?.companyName,
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: adminEmail,
      subject: 'Thank you for choosing us',
      html: html,
    });
  } catch (error) {
    throw new Error('Failed to send email');
  }
};

cron.schedule('0 0 * * *', async () => {
  try {
    // Cek apakah ada subscription yang berakhir dalam 1 hari
    const subscriptionsEndingSoon = await prisma.subscription.findMany({
      where: {
        endDate: {
          lte: new Date(new Date().setDate(new Date().getDate() + 1)),
        },
      },
      include: {
        user: true, // Sertakan data user untuk mengirim email
      },
    });

    for (const subscription of subscriptionsEndingSoon) {
      const { user } = subscription;

      const mailOptions = {
        from: process.env.MAIL_USER,
        to: user.email,
        subject: 'Reminder: Subscription will expire soon!',
        text: `Hi ${user.name},\n\nYour subscription is about to expire in 1 day! Please renew it soon to avoid service interruption.\n\nRegards,\nYour Service Team.`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${user.email}`);
    }
  } catch (error) {
    console.error('Error sending subscription reminder emails:', error);
  }
});

cron.schedule('0 0 * * *', async () => {
  try {
    // Cek subscription yang telah berakhir dan nonaktifkan
    const expiredSubscriptions = await prisma.subscription.updateMany({
      where: {
        endDate: { lte: new Date() },
        status: SubsStatus.Operating,
      },
      data: {
        status: SubsStatus.Terminated, // Menonaktifkan subscription
      },
    });

    console.log(`${expiredSubscriptions.count} subscriptions have been deactivated.`);
  } catch (error) {
    console.error('Error deactivating expired subscriptions:', error);
  }
});
