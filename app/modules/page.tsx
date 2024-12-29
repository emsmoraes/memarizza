import React, { Suspense } from "react";
import { Dialog } from "../_components/ui/dialog";
import EmptyData from "../_components/EmptyData";
import AddModuleDialog from "./_components/AddModuleDialog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import ModuleCard from "./_components/ModuleCard";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import PageHeader from "../_components/pageHeader";

async function page() {
  const session = await getServerSession(authOptions);
  const userModules = await db.module.findMany({
    where: {
      userId: session?.user?.id,
      parentId: null,
    },
  });

  return (
    <Dialog>
      <PageHeader />
      <AddModuleDialog />
      <Suspense
        fallback={
          <div className="w-full items-center justify-center">
            <AiOutlineLoading3Quarters className="animate-spin" />
          </div>
        }
      >
        <div className="mt-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {userModules.map((module) => (
            <ModuleCard module={module} key={module.id} />
          ))}
        </div>
      </Suspense>

      {!userModules || (userModules.length === 0 && <EmptyData />)}
    </Dialog>
  );
}

export default page;
