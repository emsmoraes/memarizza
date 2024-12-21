
"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export const addQuestion = async (
    data: Prisma.QuestionCreateInput,
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

        await db.question.create({
            data,
        });

        revalidatePath("/modules");
    } catch (error) {
        console.error("Error adding question:", error);
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
};

export const removeQuestion = async (questionId: string) => {
    try {
        await db.moduleSessionQuestion.deleteMany({
            where: { questionId }
        });

        await db.question.delete({
            where: { id: questionId }
        });

        revalidatePath("/modules");
    } catch (error) {
        console.log("Erro ao remover a questão e seus relacionamentos:", error);
    }
};


export const updateQuestion = async (
    questionId: string,
    data: Prisma.QuestionUpdateInput
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