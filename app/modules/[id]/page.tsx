import { db } from "@/lib/prisma";
import React, { Suspense } from "react";
import ModulePageHeader from "../_components/ModulePageHeader";
import { Dialog } from "@/app/_components/ui/dialog";
import AddModuleOrQuestionDialog from "../_components/AddModuleOrQuestionDialog";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ModuleCard from "../_components/ModuleCard";
import EmptyData from "@/app/_components/EmptyData";
import QuestionCard from "../_components/QuestionCard";

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

  const childrenModules = await db.module.findMany({
    where: {
      userId: session?.user?.id,
      parentId: params.id,
    },
  }) ?? [];

  const childrenQuestions = await db.question.findMany({
    where: {
      moduleId: params.id,
    },
    include: {
      options: true,
      subject: true,
    },
  }) ?? [];

  const userSubjects = await db.subject.findMany({
    where: {
      userId: session?.user?.id,
    },
  });

  return (
    <Dialog>
      <ModulePageHeader moduleName={moduleData?.name ?? ""} />
      <AddModuleOrQuestionDialog
        moduleId={params.id}
        userSubjects={userSubjects}
      />

      <Suspense
        fallback={
          <div className="w-full items-center justify-center">
            <AiOutlineLoading3Quarters className="animate-spin" />
          </div>
        }
      >
        <div className="mt-6 grid w-full cursor-pointer grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {childrenModules.map((module) => (
            <ModuleCard module={module} key={module.id} />
          ))}
          {childrenQuestions.map((question) => (
            <QuestionCard
              question={question}
              key={question.id}
              userSubjects={userSubjects}
            />
          ))}
        </div>
      </Suspense>

      {childrenQuestions.length === 0 && childrenModules.length === 0 && <EmptyData />}
    </Dialog>
  );
}

export default Module;
