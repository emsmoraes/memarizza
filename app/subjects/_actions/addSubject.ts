"use server"

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const addSubject = async (subjectName: string, userId: string) => {
    try {
        await db.subject.create({
            data: {
                name: subjectName,
                userId: userId
            }
        });
        revalidatePath("/subjects")
    } catch (error) {
        console.log(error)
    }

};