"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


const getAllModuleDescendants = async (moduleId: string): Promise<string[]> => {
    const children = await db.module.findMany({
        where: { parentId: moduleId },
        select: { id: true },
    });

    if (children.length === 0) {
        return [moduleId];
    }

    const descendants = await Promise.all(
        children.map((child) => getAllModuleDescendants(child.id))
    );

    return [moduleId, ...descendants.flat()];
};

export const createModuleSession = async (userId: string, moduleId: string) => {
    try {

        const moduleIds = await getAllModuleDescendants(moduleId);

        const questions = await db.question.findMany({
            where: {
                moduleId: {
                    in: moduleIds,
                },
            },
            select: {
                id: true,
            },
        });

        const moduleSession = await db.moduleSession.create({
            data: {
                userId,
                progress: 0,
                completed: false,
                createdAt: new Date(),
                moduleSessionModules: {
                    create: moduleIds.map((moduleId, index) => ({
                        moduleId: moduleId,
                        isParent: index === 0,
                    })),
                },
                moduleSessionQuestion: {
                    create: questions.map((question, index) => ({
                        questionId: question.id,
                        position: index
                    })),
                },
            },
        });

        revalidatePath("/module-sessions");

        return moduleSession;
    } catch (error) {
        console.error("Erro ao criar ModuleSession:", error);
        throw error;
    }
};

export const deleteModuleSession = async (moduleSessionId: string) => {
    try {
        await db.moduleSessionQuestion.deleteMany({
            where: {
                moduleSessionId,
            },
        });

        await db.moduleSession.delete({
            where: {
                id: moduleSessionId,
            },
        });

        revalidatePath("/sessions");
    } catch (error) {
        console.error("Erro ao deletar ModuleSession:", error);
        throw error;
    }
};
