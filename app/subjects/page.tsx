import React from "react";
import PageHeader from "../_components/PageHeader";
import EmptyData from "../_components/EmptyData";
import { Dialog } from "../_components/ui/dialog";
import AddSubjectDialog from "./_components/AddSubjectDialog";
import { db } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import SubjectCard from "./_components/SubjectCard";

async function Page() {
  const session = await getServerSession(authOptions);

  const userSubjects = await db.subject.findMany({
    where: {
      userId: session?.user?.id,
    },
  });

  return (
    <Dialog>
      <PageHeader />
      <AddSubjectDialog />
      <div className="mt-6 grid w-full cursor-pointer grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {userSubjects.map((subject) => (
          <SubjectCard subject={subject} key={subject.id} />
        ))}
      </div>
      {!userSubjects || (userSubjects.length === 0 && <EmptyData />)}
    </Dialog>
  );
}

export default Page;
