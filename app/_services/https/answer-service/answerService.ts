
"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const addOrUpdateAnswersInSession = async (
  sessionId: string,
  userId: string,
  answers: Record<string, string[]>
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

    if (!sessionQuestions.length) {
      throw new Error("Nenhuma das questões fornecidas está associada a essa sessão.");
    }

    const updates = Object.entries(answers).map(async ([questionId, answerIds]) => {
      const sessionQuestion = sessionQuestions.find(
        (q) => q.questionId === questionId
      );

      if (!sessionQuestion) {
        throw new Error(`A questão ${questionId} não está associada a essa sessão.`);
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
      } else {
        await prisma.answer.create({
          data: {
            userId,
            questionId,
            answer: answerIds.join(","),
            isCorrect,
          },
        });
      }

      await prisma.moduleSessionQuestion.update({
        where: {
          id: sessionQuestion.id,
        },
        data: {
          answered: true,
        },
      });
    });

    await Promise.all(updates);

    const totalQuestions = await prisma.moduleSessionQuestion.count({
      where: {
        moduleSessionId: sessionId,
      },
    });

    const answeredQuestions = await prisma.moduleSessionQuestion.count({
      where: {
        moduleSessionId: sessionId,
        answered: true,
      },
    });

    const progress = (answeredQuestions / totalQuestions) * 100;

    await prisma.moduleSession.update({
      where: {
        id: sessionId,
      },
      data: {
        progress,
      },
    });
  });
  revalidatePath("/sessions");
};
