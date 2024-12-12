import React, { Suspense } from "react";
import PageHeader from "../_components/PageHeader";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { db } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import EmptyData from "../_components/EmptyData";
import { FiPlusCircle } from "react-icons/fi";
import { Button } from "../_components/ui/button";
import Link from "next/link";
import ModuleSessionCard from "./_components/ModuleSessionCard";

async function Sessions() {
  const session = await getServerSession(authOptions);

  const userModuleSessions = await db.moduleSession.findMany({
    where: {
      userId: session?.user?.id,
    },
    include: {
      moduleSessionModules: {
        include: {
          module: true,
        },
      },
    },
  });

  console.log(userModuleSessions);

  return (
    <>
      <PageHeader />
      <Button asChild>
        <Link href={"/modules"}>
          <FiPlusCircle />
          Adicionar
        </Link>
      </Button>

      <Suspense
        fallback={
          <div className="w-full items-center justify-center">
            <AiOutlineLoading3Quarters className="animate-spin" />
          </div>
        }
      >
        <div className="mt-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {userModuleSessions.map((sessionModule) => (
            <ModuleSessionCard session={sessionModule} key={sessionModule.id} />
          ))}
        </div>
      </Suspense>

      {!userModuleSessions ||
        (userModuleSessions.length === 0 && <EmptyData />)}
    </>
  );
}

export default Sessions;
