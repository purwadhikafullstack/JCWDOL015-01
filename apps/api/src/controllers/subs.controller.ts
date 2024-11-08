import { Request, Response } from 'express';
import { PrismaClient, SubscriptionType } from '@prisma/client';

const prisma = new PrismaClient();


export const getAllSubscriptions = async (req: Request, res: Response) => {
    try {
        const subscriptions = await prisma.subscription.findMany();
        return res.json(subscriptions);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching subscriptions', error });
    }
};

export const purchaseSubscription = async (req: Request, res: Response) => {
    const { type, userId } = req.body;

    // Validasi tipe subscription
    if (type !== SubscriptionType.STANDARD && type !== SubscriptionType.PROFESSIONAL) {
        return res.status(400).json({ message: 'Tipe subscription tidak valid' });
    }

    try {
        // Cek apakah user sudah memiliki subscription yang aktif
        const existingSubscription = await prisma.subscription.findFirst({
            where: { userId, endDate: { gte: new Date() } }
        });

        if (existingSubscription) {
            return res.status(400).json({ message: 'Anda sudah memiliki subscription yang aktif' });
        }

        // Tentukan tanggal mulai dan akhir (30 hari)
        const startDate = new Date();
        const endDate = new Date(new Date().setDate(startDate.getDate() + 30));

        // Simpan subscription baru ke database
        const newSubscription = await prisma.subscription.create({
            data: {
                userId,
                type,
                startDate,
                endDate
            }
        });

        return res.status(201).json({
            message: `Subscription ${type} berhasil dibeli`,
            subscription: newSubscription
        });
    } catch (error) {
        console.error('Error purchasing subscription:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat membeli subscription', error });
    }
};

export const approvePayment = async (req: Request, res: Response) => {
    const { id, userId, subscriptionType } = req.body;

    if (![SubscriptionType.STANDARD, SubscriptionType.PROFESSIONAL].includes(subscriptionType)) {
        return res.status(400).json({ message: 'Invalid subscription type' });
    }

    try {
        const existingSubscription = await prisma.subscription.findFirst({
            where: { id, userId },
        });

        // Jika tidak ditemukan, kirim respon error
        if (!existingSubscription) {
            return res.status(404).json({ message: 'Subscription tidak ditemukan' });
        }

        const updatedSubscription = await prisma.subscription.update({
            where: { id: existingSubscription.id },
            data: {
                type: subscriptionType,
                startDate: new Date(),
                endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 hari dari sekarang
            },
        });
        return res.json(updatedSubscription);
    } catch (error) {
        return res.status(500).json({ message: 'Error approving payment', error });
    }
};


const subscriptionCategories = {
    STANDARD: {
        cost: 25000,
        features: ['CV Generator', 'Skill Assessment 2 kali'],
    },
    PROFESSIONAL: {
        cost: 100000,
        features: ['CV Generator', 'Skill Assessment unlimited', 'Priority review when apply job'],
    },
};

export const getSubscriptionCategories = (req: Request, res: Response) => {
    const categories = Object.entries(subscriptionCategories).map(([type, { cost, features }]) => ({
        type,
        cost,
        features,
    }));

    return res.status(200).json(categories)
}
