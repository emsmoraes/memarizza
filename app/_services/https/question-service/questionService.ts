
"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export const addQuestion = async (
    data: Prisma.QuestionCreateInput
) => {
    await db.question.create({
        data,
    });
    revalidatePath("/modules")
}

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