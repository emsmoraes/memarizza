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
  });

  return (
    <Dialog>
      <ModulePageHeader moduleName={moduleData?.name ?? ""} />
      <AddModuleOrQuestionDialog moduleId={params.id} />

      <Suspense
        fallback={
          <div className="w-full items-center justify-center">
            <AiOutlineLoading3Quarters className="animate-spin" />
          </div>
        }
      >
        <div className="mt-6 grid w-full cursor-pointer grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {childrenModules.map((subject) => (
            <ModuleCard module={subject} key={subject.id} />
          ))}
        </div>
      </Suspense>

      {!childrenModules || (childrenModules.length === 0 && <EmptyData />)}
    </Dialog>
  );
}

export default Module;
