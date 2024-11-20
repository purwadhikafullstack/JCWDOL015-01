import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createAssessment = async (req: Request, res: Response) => {
  const { developerId, title, description, difficultyLevel, questions } = req.body;

  try {
    const assessment = await prisma.skillAssessment.create({
      data: {
        developerId,
        title,
        description,
        difficultyLevel,
        questionCount: questions.length,
        isActive: true,
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

export const completeAssessment = async (req: Request, res: Response) => {
  const { assessmentId, answers, userId } = req.body;

  try {
    const assessment = await prisma.skillAssessment.findUnique({
      where: { id: assessmentId },
      include: { Question: true },
    });

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment tidak ditemukan' });
    }

    let score = 0;
    assessment.Question.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        score += 4;
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

    res.status(200).json({ message: 'Assessment selesai', score, passed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menyelesaikan assessment' });
  }
};

// Gunakan ID pengguna statis atau hardcode
export const getUserAssessments = async (req: Request, res: Response) => {
  const userId = 1;  // Ganti dengan ID yang valid untuk pengujian

  try {
    const assessments = await prisma.skillAssessment.findMany({
      where: { developerId: userId },  // Gunakan ID statis
      include: { Question: true },
    });

    res.status(200).json(assessments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data assessment' });
  }
};
