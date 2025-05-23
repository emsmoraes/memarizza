"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma, QuestionType } from "@prisma/client";

type QuestionInput = {
    text: string;
    type: QuestionType;
    options: {
        text: string;
        isCorrect: boolean;
    }[];
};


export const addQuestion = async (
  data: Prisma.QuestionCreateInput,
  moduleId: string,
) => {
  try {
    const foundModule = await db.module.findUnique({
      where: { id: moduleId },
      include: {
        submodules: true,
      },
    });

    if (foundModule && foundModule.submodules.length > 0) {
      throw new Error(
        "Não é possível criar questões em módulos que possuem submódulos.",
      );
    }

    await db.question.create({
      data,
    });

    revalidatePath("/modules");
  } catch (error) {
    console.error("Error adding question:", error);
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred.",
    );
  }
};

export const removeQuestion = async (questionId: string) => {
  try {
    await db.moduleSessionQuestion.deleteMany({
      where: { questionId },
    });

    await db.question.delete({
      where: { id: questionId },
    });

    revalidatePath("/modules");
  } catch (error) {
    console.log("Erro ao remover a questão e seus relacionamentos:", error);
  }
};

export const updateQuestion = async (
  questionId: string,
  data: Prisma.QuestionUpdateInput,
) => {
  await db.$transaction(async (prisma) => {
    await prisma.option.deleteMany({
      where: { questionId },
    });

    await prisma.answer.deleteMany({
      where: { questionId },
    });

    await prisma.question.update({
      where: { id: questionId },
      data,
    });
  });

  revalidatePath("/modules");
};

export const searchQuestionsByTextAndModule = async (
  searchText: string,
  moduleId?: string,
  page: number = 1,
  limit: number = 20,
) => {
  try {
    const skip = (page - 1) * limit;
    const take = limit;

    const modules = await db.module.findMany({
      include: {
        submodules: {
          include: {
            questions: {
              where: { public: true },
              include: {
                options: true,
                module: true,
              },
            },
          },
        },
        questions: {
          where: { public: true },
          include: {
            options: true,
            module: true,
          },
        },
      },
    });

    const foundQuestionsByText = await db.question.findMany({
      where: {
        text: {
          contains: searchText,
          mode: "insensitive",
        },
        public: true,
      },
      include: {
        options: true,
        module: true,
      },
    });

    const filteredModules = modules.filter((module) =>
      module.name.toLowerCase().includes(searchText.toLowerCase()),
    );

    const matchedQuestionsFromModules = filteredModules.flatMap((module) => [
      ...module.questions,
      ...module.submodules.flatMap((submodule) => submodule.questions),
    ]);

    const allFoundQuestions = [
      ...foundQuestionsByText,
      ...matchedQuestionsFromModules,
    ];

    const filteredQuestions = moduleId
      ? allFoundQuestions.filter((question) => question.module.id !== moduleId)
      : allFoundQuestions;

    const uniqueQuestions = Array.from(
      new Set(filteredQuestions.map((question) => question.id)),
    )
      .map((id) => filteredQuestions.find((question) => question.id === id))
      .filter(
        (question): question is NonNullable<typeof question> => !!question,
      );

    const paginatedQuestions = uniqueQuestions.slice(skip, skip + take);

    return paginatedQuestions;
  } catch (error) {
    console.error("Erro ao buscar questões:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Erro inesperado ao buscar questões.",
    );
  }
};

export const cloneQuestionsToModule = async (
  questionIds: string[],
  targetModuleId: string,
) => {
  try {
    const targetModule = await db.module.findUnique({
      where: { id: targetModuleId },
    });

    if (!targetModule) {
      throw new Error("O módulo de destino não foi encontrado.");
    }

    const questionsToClone = await db.question.findMany({
      where: { id: { in: questionIds } },
      include: {
        options: true,
      },
    });

    if (questionsToClone.length === 0) {
      throw new Error("Nenhuma questão válida foi encontrada para clonar.");
    }

    await db.question.createMany({
      data: questionsToClone.map((question) => ({
        text: question.text,
        type: question.type,
        moduleId: targetModuleId,
        public: false,
      })),
    });

    const clonedQuestionsWithId = await db.question.findMany({
      where: {
        moduleId: targetModuleId,
        text: { in: questionsToClone.map((q) => q.text) },
      },
    });

    if (clonedQuestionsWithId.length !== questionsToClone.length) {
      throw new Error("Erro ao clonar todas as questões.");
    }

    const optionsToCreate = questionsToClone.flatMap((question, index) =>
      question.options.map((option) => ({
        text: option.text,
        isCorrect: option.isCorrect,
        questionId: clonedQuestionsWithId[index].id,
      })),
    );

    await db.option.createMany({
      data: optionsToCreate,
    });

    revalidatePath("/modules");
  } catch (error) {
    console.error("Erro ao clonar questões:", error);
    throw new Error(
      error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
    );
  }
};

export const addQuestions = async (
    questions: QuestionInput[],
    moduleId: string
) => {
    try {
        const foundModule = await db.module.findUnique({
            where: { id: moduleId },
            include: {
                submodules: true,
            },
        });

        if (foundModule && foundModule.submodules.length > 0) {
            throw new Error("Não é possível criar questões em módulos que possuem submódulos.");
        }

        // Prepare os dados para criação
        const preparedQuestions = questions.map((question) => ({
            text: question.text,
            type: question.type,
            moduleId,
            options: {
                create: question.options.map((option) => ({
                    text: option.text,
                    isCorrect: option.isCorrect,
                })),
            },
        }));

        for (const questionData of preparedQuestions) {
            await db.question.create({
                data: questionData,
            });
        }

        revalidatePath("/modules");
    } catch (error) {
        console.error("Error adding questions:", error);
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
};
