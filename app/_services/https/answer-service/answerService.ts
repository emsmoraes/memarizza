"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updateModuleSessionProgress = async (
  sessionId: string,
  answeredQuestions: number,
): Promise<void> => {
  const totalQuestions = await prisma.moduleSessionQuestion.count({
    where: {
      moduleSessionId: sessionId,
    },
  });

  const progress =
    totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  console.log(progress);

  await prisma.moduleSession.update({
    where: {
      id: sessionId,
    },
    data: {
      progress,
    },
  });

  revalidatePath("/sessions");
};

export const addOrUpdateAnswersInSession = async (
  sessionId: string,
  userId: string,
  answers: Record<string, string[]>,
) => {
  await db.$transaction(async (prisma) => {
    const sessionQuestions = await prisma.moduleSessionQuestion.findMany({
      where: {
        moduleSessionId: sessionId,
        questionId: { in: Object.keys(answers) },
      },
      include: {
        question: {
          include: {
            options: true,
          },
        },
      },
    });

    const updates = Object.entries(answers).map(
      async ([questionId, answerIds]) => {
        const sessionQuestion = sessionQuestions.find(
          (q) => q.questionId === questionId,
        );

        if (!sessionQuestion) {
          throw new Error(
            `A questão ${questionId} não está associada a essa sessão.`,
          );
        }

        if (
          (answerIds.length === 1 && answerIds[0] === "") ||
          answerIds.length === 0
        ) {
          await prisma.moduleSessionQuestion.update({
            where: {
              id: sessionQuestion.id,
              questionId: questionId,
            },
            data: {
              answered: false,
            },
          });

          await prisma.answer.deleteMany({
            where: {
              questionId: questionId,
            },
          });

          const answeredQuestions = await prisma.moduleSessionQuestion.count({
            where: {
              moduleSessionId: sessionId,
              answered: true,
            },
          });

          await updateModuleSessionProgress(sessionId, answeredQuestions);

          return;
        }

        const correctAnswers = sessionQuestion.question.options
          .filter((option) => option.isCorrect)
          .map((option) => option.id);

        const isCorrect =
          answerIds.every((id) => correctAnswers.includes(id)) &&
          correctAnswers.length === answerIds.length;

        const existingAnswer = await prisma.answer.findFirst({
          where: {
            questionId,
            userId,
          },
        });

        if (existingAnswer) {
          await prisma.answer.update({
            where: {
              id: existingAnswer.id,
            },
            data: {
              answer: answerIds.join(","),
              isCorrect,
            },
          });
        } else if (answerIds.length > 0) {
          const validAnswers = answerIds.filter((id) => id.trim() !== "");

          if (validAnswers.length > 0) {
            await prisma.answer.create({
              data: {
                userId,
                questionId,
                answer: validAnswers.join(","),
                isCorrect,
              },
            });
          }
        }

        await prisma.moduleSessionQuestion.update({
          where: {
            id: sessionQuestion.id,
            questionId: questionId,
          },
          data: {
            answered: true,
          },
        });
      },
    );

    await Promise.all(updates);

    const answeredQuestions = await prisma.moduleSessionQuestion.count({
      where: {
        moduleSessionId: sessionId,
        answered: true,
      },
    });

    await updateModuleSessionProgress(sessionId, answeredQuestions);
  });
};
