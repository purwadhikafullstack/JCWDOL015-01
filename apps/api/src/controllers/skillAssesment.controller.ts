import { Request, Response } from 'express';
import { DifficultyLevel, PrismaClient } from '@prisma/client';
import { sendDeveloperNotification } from '@/helper/nodemailer';

const prisma = new PrismaClient();

export const createAssessment = async (req: Request, res: Response) => {
  const { title, description, questions } = req.body;
  const developerId = Number(req.params.developerId)

  try {
    const assessment = await prisma.skillAssessment.create({
      data: {
        title,
        description,
        difficultyLevel: DifficultyLevel.EASY || DifficultyLevel.MEDIUM || DifficultyLevel.HARD,
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
  const { userId } = req.params;  // Assuming userId comes from the route parameter

  if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({ message: "User ID is required" });
  }

  try {
      const completedAssessments = await prisma.userAssessment.findMany({
          where: { userId: Number(userId) },
          select: { assessmentId: true },
      });

      const completedIds = completedAssessments.map((assessment) => assessment.assessmentId);

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

      res.status(200).json(formattedAssessments);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch assessments." });
  }
};

// Controller to complete assessment
export const completeAssessment = async (req: Request, res: Response) => {
  const { userId, assessmentId, answers } = req.body;

  if (!assessmentId || !answers || !userId) {
      return res.status(400).json({ message: "Missing required fields (assessmentId, answers, userId)" });
  }

  try {
      const assessment = await prisma.skillAssessment.findUnique({
          where: { id: assessmentId },
          include: { Question: true },
      });

      if (!assessment) {
          return res.status(404).json({ message: "Assessment not found." });
      }

      if (assessment.Question.length !== answers.length) {
          return res.status(400).json({
              message: `Number of answers (${answers.length}) does not match the number of questions (${assessment.Question.length}).`,
          });
      }

      let score = 0;
      assessment.Question.forEach((question, index) => {
          if (question.correctAnswer === answers[index]) {
              score += 4;
          }
      });

      const totalScore = assessment.Question.length * 4;
      const passed = score >= totalScore * 0.75;

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
      res.status(500).json({ message: "Failed to complete the assessment." });
  }
};
