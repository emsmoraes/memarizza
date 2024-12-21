
"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const addModule = async (
    moduleName: string,
    moduleDescription: string | undefined,
    userId: string,
    existingModuleId: string | null | undefined
) => {
    try {
        const existingModule = await db.module.findFirst({
            where: {
                name: moduleName,
                userId: userId,
            },
        });

        if (existingModule) {
            throw new Error("Já existe um módulo com esse nome");
        }

        await db.module.create({
            data: {
                name: moduleName,
                description: moduleDescription,
                userId: userId,
                parentId: existingModuleId,
                ...(existingModuleId && { parentId: existingModuleId }),
            },
        });

        revalidatePath("/modules");
        if (existingModuleId)
            revalidatePath(`/modules/${existingModuleId}`)
    } catch (error) {
        console.error("Error adding subject:", error);
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
};

export const removeModule = async (moduleId: string) => {
    try {
        await db.moduleSessionModule.deleteMany({
            where: {
                moduleId,
            },
        });

        await db.question.deleteMany({
            where: {
                moduleId: moduleId,
            },
        });

        const submodules = await db.module.findMany({
            where: {
                parentId: moduleId,
            },
        });

        for (const submodule of submodules) {
            await removeModule(submodule.id);
        }

        await db.module.delete({
            where: {
                id: moduleId,
            },
        });

        revalidatePath("/modules");
    } catch (error) {
        console.log("Erro ao excluir o módulo:", error);
    }
};
