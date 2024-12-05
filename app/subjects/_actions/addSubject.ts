"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const addSubject = async (subjectName: string, userId: string) => {
    try {
        const existingSubject = await db.subject.findFirst({
            where: {
                name: subjectName,
                userId: userId,
            },
        });

        if (existingSubject) {
            throw new Error("Já existe uma disciplina com esse nome");
        }

        await db.subject.create({
            data: {
                name: subjectName,
                userId: userId,
            },
        });

        revalidatePath("/subjects");
    } catch (error) {
        console.error("Error adding subject:", error);
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
};
