import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createAssessment = async (req: Request, res: Response) => {
    const { developerId, title, description, difficultyLevel, questions } = req.body;

    try {
        // Buat assessment baru
        const assessment = await prisma.skillAssessment.create({
            data: {
                developerId,
                title,
                description,
                difficultyLevel,
                questionCount: questions.length,
                isActive: true,
                Question:
                 {
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

export const completeAssessment = async (req: Request, res: Response) => {
    const { userId, assessmentId, answers } = req.body;

    try {
        const assessment = await prisma.skillAssessment.findUnique({
            where: { id: assessmentId },
            include: { Question: true },
        });

        if (!assessment) {
            return res.status(404).json({ message: 'Assessment tidak ditemukan' });
        }

        // Hitung skor berdasarkan jawaban
        let score = 0;
        assessment.Question.forEach((questions, index) => {
            if (questions.correctAnswer === answers[index]) {
                score += 4; // Misalkan benar bernilai 4 poin
            }
        });

        const passed = score >= 75;
        await prisma.userAssessment.create({
            data: {
                userId,
                assessmentId,
                score,
                passed,
                completedAt: new Date(),
            },
        });

        // Jika lulus, berikan badge
        if (passed) {
            await prisma.badge.create({
                data: {
                    userId,
                    title: `${assessment.title} - Lulus`,
                    description: 'Lulus penilaian keterampilan ini',
                },
            });
        }

        res.status(200).json({ message: 'Assessment selesai', score, passed });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menyelesaikan assessment' });
    }
};


export const createQuestion = async (req: Request, res: Response) => {
    const { assessmentId, questionText, options, correctAnswer } = req.body;

    try {
        const question = await prisma.question.create({
            data: {
                assessmentId,
                content: questionText,
                options,
                correctAnswer,
            },
        });
        res.status(201).json({ question });
    } catch (error) {
        res.status(500).json({ error: "Failed to create question." });
    }
};


export const submitAssessment = async (req: Request, res: Response) => {
    const { userId, assessmentId, answers } = req.body;

    try {
        const questions = await prisma.question.findMany({
            where: { assessmentId: assessmentId },
        });

        let correctCount = 0;

        questions.forEach((question, index) => {
            if (answers[index] === question.correctAnswer) {
                correctCount += 1;
            }
        });

        const score = (correctCount / questions.length) * 100;
        const isPassed = score >= 75;

        res.status(200).json({ score, isPassed });
    } catch (error) {
        res.status(500).json({ error: "Failed to submit assessment." });
    }
};
