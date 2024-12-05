"use server"

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const removeSubject = async (subjectId: string) => {
    try {
        await db.subject.delete({
            where: {
                id: subjectId
            }
        })
        revalidatePath("/subjects")
    } catch (error) {
        console.log(error)
    }
};