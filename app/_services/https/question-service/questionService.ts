
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