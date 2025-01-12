"use server";

import { db } from "@/lib/prisma";

export const getModuleSessionByModuleId = async (moduleId: string) => {
    try {
      const moduleSessions = await db.moduleSession.findMany({
        where: {
          moduleSessionModules: {
            some: {
              moduleId,
            },
          },
        },
        include: {
          moduleSessionModules: true,
          moduleSessionQuestion: {
            include: {
              question: true,
            },
          },
        },
      });
  
      return moduleSessions;
    } catch (error) {
      console.error("Error fetching module sessions:", error);
      throw new Error(
        error instanceof Error ? error.message : "Ocorreu um erro inesperado."
      );
    }
  };
