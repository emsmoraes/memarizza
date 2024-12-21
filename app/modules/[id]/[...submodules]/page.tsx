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

interface ModuleProps {
  params: {
    submodules: string[];
  };
}

async function Module({ params }: ModuleProps) {
  const session = await getServerSession(authOptions);
  const currentSubmoduleId = params.submodules[params.submodules.length - 1];

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
    },
  });

  return (
    <Dialog>
      <ModulePageHeader moduleName={moduleData?.name ?? ""} />
      <AddModuleOrQuestionDialog
        moduleId={currentSubmoduleId}
      />

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
