import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendBillingEmail } from '../helper/emailHelper';

const prisma = new PrismaClient();

// Fungsi untuk memeriksa dan memperbarui status subscription
export const checkAndUpdateSubscriptions = async () => {
    const now = new Date();
    const subscriptions = await prisma.subscription.findMany({
        where: {
            endDate: {
                lte: now,
            },
        },
    });

    for (const subscription of subscriptions) {
        // Nonaktifkan fitur jika subscription berakhir
        await prisma.user.update({
            where: { id: subscription.userId },
            data: {
                subscriptionType: null,
                subscriptionEndDate: null,
            },
        });

        // Kirim email tagihan satu hari sebelum berakhir
        const daysBeforeExpiry = new Date(subscription.endDate);
        daysBeforeExpiry.setDate(daysBeforeExpiry.getDate() - 1);

        if (now >= daysBeforeExpiry && now < subscription.endDate) {
            await sendBillingEmail(subscription.userId, subscription.type);
        }
    }
};

// Mendapatkan semua subscription yang akan berakhir
export const getEndingSubscriptions = async (req: Request, res: Response) => {
    const now = new Date();
    const endingSubscriptions = await prisma.subscription.findMany({
        where: {
            endDate: {
                gte: now,
                lte: new Date(now.setDate(now.getDate() + 30)), // Dalam 30 hari ke depan
            },
        },
    });
    return res.json(endingSubscriptions);
};
