import { Request, Response } from 'express';
import { DifficultyLevel, PrismaClient, SubscriptionType, SubsStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const createAssessment = async (req: Request, res: Response) => {
    const { title, description, questions, difficultyLevel, developerId } = req.body

    const validDifficulties = [DifficultyLevel.EASY, DifficultyLevel.MEDIUM, DifficultyLevel.HARD]
    const selectedDifficulty = validDifficulties.includes(difficultyLevel)
        ? difficultyLevel : DifficultyLevel.EASY

    try {
        const assessment = await prisma.skillAssessment.create({
            data: {
                title,
                description,
                difficultyLevel: selectedDifficulty,
                questionCount: questions.length,
                isActive: true,
                developer: {
                    connect: { id: developerId }
                },
                Question: {
                    create: questions.map((q: any) => ({
                        content: q.content,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                    })),
                },
            },
        });

        res.status(201).json({ message: 'Assessment berhasil dibuat', assessment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal membuat assessment' });
    }
};

export const getUserAssessments = async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId || isNaN(Number(userId))) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            include: {
                subscriptions: true,
                UserAssessment: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const completedAssessments = user.UserAssessment.length;

        const limit = user.subscriptions[0]?.type === SubscriptionType.STANDARD ? 2 : Infinity
        const remainingAssessments = limit - completedAssessments;

        const completedIds = user.UserAssessment.map((assessment) => assessment.assessmentId);
        const incompleteAssessments = await prisma.skillAssessment.findMany({
            where: {
                id: {
                    notIn: completedIds,
                },
            },
            include: { Question: true },
        });

        const formattedAssessments = incompleteAssessments.map((assessment) => ({
            id: assessment.id,
            title: assessment.title,
            description: assessment.description,
            difficultyLevel: assessment.difficultyLevel,
            developerId: assessment.developerId,
            questions: assessment.Question.map((q) => ({
                content: q.content,
                options: q.options,
            })),
        }));

        res.status(200).json({
            Assessments: formattedAssessments,
            Subs: {
                type: user.subscriptions[0]?.type,
                completedAssessments,
                remainingAssessments,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch assessments." });
    }
};


export const completeAssessment = async (req: Request, res: Response) => {
    const { userId, assessmentId, answers } = req.body;

    if (!assessmentId || !answers || !userId) {
        return res.status(400).json({ message: "Missing required fields (assessmentId, answers, userId)" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            include: {
                subscriptions: {
                    where: { status: SubsStatus.Operating }
                }
            }
        })

        if (!user || user.subscriptions.length === 0) {
            return res.status(400).send({ message: "User does not have an active Subscriptions" })
        }

        const subsFindStatus = user.subscriptions[0]
        const isProfessional = subsFindStatus.type === SubscriptionType.PROFESSIONAL
        const isStandard = subsFindStatus.type === SubscriptionType.STANDARD

        if (isStandard) {
            const completedCount = await prisma.userAssessment.count({
                where: {
                    userId: parseInt(userId, 10),
                    completedAt: {
                        gte: subsFindStatus.startDate,
                        lte: subsFindStatus.endDate
                    }
                }
            })
            if (completedCount >= 2) {
                return res.status(403).json({
                    message: "You have reached the maximum number of assessments for your subscription.",
                    completedCount,
                    limit: 2,
                })
            }
        }

        const assessment = await prisma.skillAssessment.findUnique({
            where: { id: assessmentId },
            include: { Question: true },
        })

        if (!assessment) {
            return res.status(404).json({ message: "Assessment not found." })
        }

        if (assessment.Question.length !== answers.length) {
            return res.status(400).json({
                message: `Number of answers (${answers.length}) does not match the number of questions (${assessment.Question.length}).`,
            })
        }

        let score = 0;
        assessment.Question.forEach((question, index) => {
            if (question.correctAnswer === answers[index]) {
                score += 4;
            }
        })

        const totalScore = assessment.Question.length * 4
        const passed = score >= totalScore * 0.75

        await prisma.userAssessment.create({
            data: {
                userId: parseInt(userId, 10),
                assessmentId,
                score,
                passed,
                completedAt: new Date(),
            },
        });

        res.status(200).json({
            message: "Assessment completed successfully.",
            score,
            passed,
        });
    } catch (error) {
        console.error("Error completing assessment:", error);
        res.status(500).json({ message: "Failed to complete the assessment." })
    }
}