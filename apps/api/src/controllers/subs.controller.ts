import { Request, Response } from 'express';
import { PaymentMethod, PaymentStatus, PrismaClient, SubscriptionType, SubsStatus } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();
const myUUID = randomUUID()

export const getAllSubscriptions = async (req: Request, res: Response) => {
    try {
        const subscriptions = await prisma.subscription.findMany();
        return res.json(subscriptions);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching subscriptions', error });
    }
};

export const purchaseSubscription = async (req: Request, res: Response) => {
    console.log('Request Body:', req.body)
    const { type, paymentMethod, userId } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'User tidak terautentikasi' });
    }

    if (!(type in subscriptionCategories)) {
        return res.status(400).json({ message: 'Tipe subscription tidak valid' });
    }

    const selectedCategory = subscriptionCategories[type as keyof typeof subscriptionCategories];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + selectedCategory.durationInDays);

    try {
        const newSubscription = await prisma.subscription.create({
            data: {
                userId,
                type,
                startDate,
                endDate,
                status: SubsStatus.Wait,
                payments: {
                    create: {
                        userId,
                        amount: selectedCategory.cost,
                        paymentMethod: paymentMethod === "No Methods" ? PaymentMethod.GATEWAY : PaymentMethod.MANUAL,
                        paymentDate: new Date(),
                        status: paymentMethod === 'MANUAL' ? PaymentStatus.PENDING : PaymentStatus.APPROVED,
                        transactionId: myUUID
                    }
                }
            },
            include: { payments: true }
        });

        return res.status(201).json({
            message: 'Pembelian berhasil',
            subscription: newSubscription
        });

    } catch (error) {
        console.error('Error purchasing subscription:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat membeli subscription', error });
    }
};

export const approvePayment = async (req: Request, res: Response) => {
    const { id, userId, subscriptionType } = req.body;

    const selectedCategory = subscriptionCategories[subscriptionType as keyof typeof subscriptionCategories]
    if (!selectedCategory) {
        return res.status(400).json({ message: "Subscription Type is not Valid" })
    }

    try {
        const existingSubscription = await prisma.subscription.findFirst({
            where: {
                id,
                userId,
            }, include: {
                payments: true
            },
        });

        if (!existingSubscription) {
            return res.status(404).json({ message: 'Subscription tidak ditemukan' });
        }

        const updatedSubscription = await prisma.subscription.update({
            where: { id: existingSubscription.id },
            data: {
                type: subscriptionType,
                status: SubsStatus.Operating,
                startDate: new Date(),
                endDate: new Date(new Date().setDate(new Date().getDate() + selectedCategory.durationInDays)),
            },
        });
        await prisma.paymentHistory.updateMany({
            where: { subscripstionId: existingSubscription.id, status: PaymentStatus.PENDING },
            data: { status: PaymentStatus.APPROVED }
        })

        if (updatedSubscription) {
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    isVerified: true,
                    subscriptionType,
                    subscriptionEndDate: updatedSubscription.endDate
                }
            })
            return res.status(201).send({
                message: 'Subs was Updated and User Verified Succesfully',
                subs: updatedSubscription,
                user: updatedUser,
                cost: selectedCategory.cost,
                features: selectedCategory.features
            });
        } else {
            return res.status(500).json({ message: 'Failed to update subscription' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error approving payment', error });
    }
};

export const getPendingSubscriptions = async (req: Request, res: Response) => {
    try {
        const pendingSubscriptions = await prisma.subscription.findMany({
            where: { status: SubsStatus.Wait },
            include: {
                user: true,
                payments: true,
            },
        });

        if (pendingSubscriptions.length === 0) {
            return res.status(404).send({message: 'No Subscriptions Found'})
        }

        return res.status(200).json(pendingSubscriptions);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching pending subscriptions", error });
    }
};



const subscriptionCategories = {
    [SubscriptionType.NORMAL]: {
        type: SubscriptionType.NORMAL,
        cost: 0,
        features: ['Basic access'],
        durationInDays: 7,
        maxAssessments: 0,
    },
    [SubscriptionType.STANDARD]: {
        type: SubscriptionType.STANDARD,
        cost: 25000,
        features: ['CV Generator', 'Skill Assessment 2 kali'],
        durationInDays: 30,
        maxAssessments: 2,
    },
    [SubscriptionType.PROFESSIONAL]: {
        type: SubscriptionType.PROFESSIONAL,
        cost: 100000,
        features: ['CV Generator', 'Skill Assessment unlimited', 'Priority review when apply job'],
        durationInDays: 30,
        maxAssessments: -1,
    },
};

export const getSubscriptionCategories = (req: Request, res: Response) => {
    const categories = Object.entries(subscriptionCategories).map(([type, { cost, features, durationInDays }]) => ({
        type,
        cost,
        features,
        durationInDays
    }));

    return res.status(200).json(categories)
}

export const getUserSubsandPayDetails = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            include: {
                subscriptions: {
                    include: {
                        payments: true
                    }
                },
                paymentHistories: true
            }
        })
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(400).send({ message: "There is no Payment Approved" })
        }
    } catch (error) {
        res.status(500).send({ message: "Error on Server" })
        console.error(error)
    }
}