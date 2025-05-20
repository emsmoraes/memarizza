import { db } from "@/lib/prisma";
import React, { Suspense } from "react";
import { Dialog } from "@/app/_components/ui/dialog";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import EmptyData from "@/app/_components/EmptyData";
import ModulePageHeader from "../../_components/ModulePageHeader";
import AddModuleOrQuestionDialog from "../../_components/AddModuleOrQuestionDialog";
import ListModulesAndQuestions from "../../_components/ListModulesAndQuestions";
import ImportQuestions from "../../_components/ImportQuestions";
import StartModuleSession from "../../_components/StartModuleSession";

type ModuleProps = {
  params: Promise<{
    submodules: string[];
  }>;
};

async function Module({ params }: ModuleProps) {
  const resolvedParams = await params;
  const currentSubmoduleId =
    resolvedParams.submodules[resolvedParams.submodules.length - 1];

  const session = await getServerSession(authOptions);

  const moduleData = await db.module.findUnique({
    where: {
      id: currentSubmoduleId,
    },
  });

  const childrenModules = await db.module.findMany({
    where: {
      userId: session?.user?.id,
      parentId: currentSubmoduleId,
    },
  });

  const childrenQuestions = await db.question.findMany({
    where: {
      moduleId: currentSubmoduleId,
    },
    include: {
      options: true,
      module: true,
    },
  });

  const moduleSession = await db.moduleSession.findMany({
    where: {
      moduleSessionModules: {
        some: {
          moduleId: currentSubmoduleId,
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

  return (
    <Dialog>
      <ModulePageHeader moduleName={moduleData?.name ?? ""} />

      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <AddModuleOrQuestionDialog
            hasModules={childrenModules.length > 0}
            hasQuestions={childrenQuestions.length > 0}
            moduleId={currentSubmoduleId}
          />
          <ImportQuestions moduleId={currentSubmoduleId} />
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
