import { db } from "@/lib/prisma";
import moment from "moment";
import ClientPage from "./_components/ClientPage";
import SessionPageHeader from "./_components/SessionPageHeader";

interface SessionPageProps {
  params: { id: string };
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = params;

  const userModuleSession = await db.moduleSession.findFirst({
    where: {
      id,
    },
    include: {
      moduleSessionModules: {
        include: {
          module: true,
        },
      },
    },
  });

  const userModuleQuestions = await db.moduleSessionQuestion.findMany({
    where: {
      moduleSessionId: id,
    },
    include: {
      question: {
        include: {
          options: true,
          answer: true,
        },
      },
    },
  });

  const userQuestions = userModuleQuestions.map(
    (question) => question.question,
  );
  const parentModule = userModuleSession?.moduleSessionModules.find(
    (i) => i.isParent,
  );

  return (
    <div className="flex flex-col h-full max-h-full">
      <SessionPageHeader
        text={`${parentModule?.module.name} - ${moment(userModuleSession?.createdAt).format("DD/MM/YYYY")}`}
      />

      <ClientPage questions={userQuestions} sessionId={id}/>
    </div>
  );
}
