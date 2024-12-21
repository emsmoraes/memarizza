"use client";

import { Prisma } from "@prisma/client";
import React from "react";
import ModuleCard from "../ModuleCard";
import QuestionCard from "../QuestionCard";

interface ListModulesAndQuestionsProps {
  childrenQuestions: Prisma.QuestionGetPayload<{
    include: {
      options: true;
    };
  }>[];

  childrenModules: {
    id: string;
    name: string;
    description: string | null;
    userId: string;
    parentId: string | null;
  }[];
}

function ListModulesAndQuestions({
  childrenModules,
  childrenQuestions,
}: ListModulesAndQuestionsProps) {
  return (
    <div>
      <div className="mt-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {childrenModules.map((module) => (
          <div key={module.id}>
            <ModuleCard module={module} />
          </div>
        ))}

        {childrenQuestions.map((question) => (
          <QuestionCard
            question={question}
            key={question.id}
          />
        ))}
      </div>
    </div>
  );
}

export default ListModulesAndQuestions;
