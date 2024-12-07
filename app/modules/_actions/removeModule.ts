"use server"

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const removeModule = async (moduleId: string) => {
    try {
        await db.module.delete({
            where: {
                id: moduleId
            }
        })
        revalidatePath("/modules")
    } catch (error) {
        console.log(error)
    }
};