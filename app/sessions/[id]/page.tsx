import { db } from "@/lib/prisma";
import moment from "moment";
import ClientPage from "./_components/ClientPage";
import SessionPageHeader from "./_components/SessionPageHeader";

type SessionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SessionPage({ params }: SessionPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

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
    orderBy: {
      position: "asc",
    },
  });

  const userQuestions = userModuleQuestions.map(
    (question) => question.question,
  );
  const parentModule = userModuleSession?.moduleSessionModules.find(
    (i) => i.isParent,
  );

  return (
    <div className="flex h-full max-h-full flex-col">
      <SessionPageHeader
        text={`${parentModule?.module.name} - ${moment(userModuleSession?.createdAt).format("DD/MM/YYYY")}`}
      />

      <ClientPage questions={userQuestions} sessionId={id} />
    </div>
  );
}
