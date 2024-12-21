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

interface ModuleProps {
  params: {
    id: string;
  };
}

async function Module({ params }: ModuleProps) {
  const session = await getServerSession(authOptions);

  const moduleData = await db.module.findUnique({
    where: {
      id: params.id,
    },
  });

  const childrenModules =
    (await db.module.findMany({
      where: {
        userId: session?.user?.id,
        parentId: params.id,
      },
    })) ?? [];

  const childrenQuestions =
    (await db.question.findMany({
      where: {
        moduleId: params.id,
      },
      include: {
        options: true,
        subject: true,
      },
    })) ?? [];

  const userSubjects = await db.subject.findMany({
    where: {
      userId: session?.user?.id,
    },
  });

  return (
    <Dialog>
      <ModulePageHeader moduleName={moduleData?.name ?? ""} />

      <div className="flex w-full items-center justify-between">
        <AddModuleOrQuestionDialog
          moduleId={params.id}
          userSubjects={userSubjects}
        />
        <StartModuleSession
          moduleId={moduleData?.id ?? ""}
          userId={session?.user?.id ?? ""}
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
          userSubjects={userSubjects}
        />
      </Suspense>

      {childrenQuestions.length === 0 && childrenModules.length === 0 && (
        <EmptyData />
      )}
    </Dialog>
  );
}

export default Module;
