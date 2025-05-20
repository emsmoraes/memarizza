import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import moment from "moment";
import { db } from "@/lib/prisma";

export async function GetChart() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = [];

  for (let i = 5; i >= 0; i--) {
    const start = moment().subtract(i, "months").startOf("month").toDate();
    const end = moment().subtract(i, "months").endOf("month").toDate();

    const [moduleCount, sessionCount, questionCount] = await Promise.all([
      db.module.count({
        where: {
          userId,
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
      db.moduleSession.count({
        where: {
          userId,
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
      db.question.count({
        where: {
          module: {
            userId,
          },
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
    ]);

    data.push({
      name: moment(start).format("MMM"),
      modules: moduleCount,
      sessions: sessionCount,
      questions: questionCount,
    });
  }

  return NextResponse.json(data);
}

export async function GetResume() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [modules, sessions, questions, answers] = await Promise.all([
    db.module.count({ where: { userId } }),
    db.moduleSession.count({ where: { userId } }),
    db.question.count({ where: { module: { userId } } }),
    db.answer.count({ where: { userId } }),
  ]);

  return NextResponse.json({
    modules,
    sessions,
    questions,
    answers,
  });
}
