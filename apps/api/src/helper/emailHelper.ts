import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
const Prisma = new PrismaClient()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export const sendBillingEmail = async (userId: number, subscriptionType: string) => {
    const User_Email = await Prisma.user.findFirst({
        where: { id: userId },
        select: { email: true }
    })

    if (!User_Email || User_Email.email ) {
        console.error("Email tidak ditemukan untuk user ini: ", userId)
        return
    }

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: User_Email.email,
        subject: 'Tagihan Subscription Anda',
        text: `Tagihan untuk subscription ${subscriptionType} Anda akan berakhir. Silakan perpanjang subscription Anda.`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
