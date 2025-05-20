import { db } from "@/lib/prisma";
import React, { Suspense } from "react";
import ModulePageHeader from "../_components/ModulePageHeader";
import { Dialog } from "@/app/_components/ui/dialog";
import AddModuleOrQuestionDialog from "../_components/AddModuleOrQuestionDialog";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import EmptyData from "@/app/_components/EmptyData";
import StartModuleSession from "../_components/StartModuleSession";
import ListModulesAndQuestions from "../_components/ListModulesAndQuestions";
import ImportQuestions from "../_components/ImportQuestions";

type ModuleProps = {
  params: Promise<{
    id: string;
  }>;
};

async function Module({ params }: ModuleProps) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  const moduleId = resolvedParams.id;

  const moduleData = await db.module.findUnique({
    where: {
      id: moduleId,
    },
  });

  const moduleSession = await db.moduleSession.findMany({
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

  const childrenModules =
    (await db.module.findMany({
      where: {
        userId: session?.user?.id,
        parentId: moduleId,
      },
    })) ?? [];

  const childrenQuestions =
    (await db.question.findMany({
      where: {
        moduleId: moduleId,
      },
      include: {
        options: true,
        module: true,
      },
    })) ?? [];

  return (
    <Dialog>
      <ModulePageHeader moduleName={moduleData?.name ?? ""} />

      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <AddModuleOrQuestionDialog
            hasModules={childrenModules.length > 0}
            hasQuestions={childrenQuestions.length > 0}
            moduleId={moduleId}
          />
          <ImportQuestions moduleId={moduleId} />
        </div>

        <StartModuleSession
          moduleId={moduleData?.id ?? ""}
          userId={session?.user?.id ?? ""}
          hasSessionInModule={moduleSession?.[0]?.id ?? null}
        />
      </div>

      <Suspense
        fallback={
          <div className="w-full items-center justify-center">
            <AiOutlineLoading3Quarters className="animate-spin" />
          </div>
        }
      >
        <ListModulesAndQuestions
          childrenModules={childrenModules}
          childrenQuestions={childrenQuestions}
        />
      </Suspense>

      {childrenQuestions.length === 0 && childrenModules.length === 0 && (
        <EmptyData />
      )}
    </Dialog>
  );
}

export default Module;
