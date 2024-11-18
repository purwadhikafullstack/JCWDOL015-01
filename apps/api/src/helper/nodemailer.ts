import { sign } from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import prisma from '@/prisma';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
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

export const sendMailBlockedUser = async (userEmail: string) => {
  try {
    const payload = { email: userEmail };
    const token = sign(payload, process.env.JWT!, { expiresIn: '10m' });

    const templatePath = path.join(
      __dirname,
      '../templates/blockedUser.hbs',
    );
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = Handlebars.compile(templateSource);
    const html = compiledTemplate({
      link: `http://localhost:3000/user/reset-password/${token}`,
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: userEmail,
      subject: 'Account blocked',
      text: 'Your account has been blocked',
    });
  } catch (error) {
    throw new Error('Failed to send email');
  }
}
