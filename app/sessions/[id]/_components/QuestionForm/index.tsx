"use client";
import { Prisma } from ".prisma/client";
import { Button } from "@/app/_components/ui/button";
import React from "react";
import QuestionOption from "../QuestionOption";

interface QuestionFormProps {
  currentQuestion: Prisma.QuestionGetPayload<{
    include: {
      options: true;
    };
  }>;
  currentAnswer: string[];
  handleAnswer: (questionId: string, answers: string[]) => void;
  handleNextQuestion: () => void;
}

function QuestionForm({
  currentQuestion,
  currentAnswer,
  handleAnswer,
  handleNextQuestion,
}: QuestionFormProps) {
  const handleOptionClick = (optionId: string) => {
    const isMultiple = currentQuestion.type === "MULTIPLE_CHOICE";

    if (isMultiple) {
      const updatedAnswers = currentAnswer.includes(optionId)
        ? currentAnswer.filter((id) => id !== optionId)
        : [...currentAnswer, optionId];
      handleAnswer(currentQuestion.id, updatedAnswers);
    } else {
      handleAnswer(currentQuestion.id, [optionId]);
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col rounded-2xl bg-accent-foreground/5 p-4">
      <h1 className="mb-6 flex items-center gap-2 text-xl">
        <span className="block text-sm">
          {currentQuestion.type === "MULTIPLE_CHOICE"
            ? "(Multipla)"
            : "(Única)"}
        </span>
        <div
          className="block [&>img]:h-auto [&>img]:max-w-[400px]"
          dangerouslySetInnerHTML={{ __html: currentQuestion.text }}
        />
      </h1>

      <div className="space-y-3">
        {currentQuestion.options.map((option, i) => (
          <QuestionOption
            currentAnswer={currentAnswer}
            handleOptionClick={handleOptionClick}
            index={i}
            option={option}
            key={option.id}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button
          className="h-10 w-10 rounded-full p-0 text-xl"
          onClick={handleNextQuestion}
        >
          &gt;
        </Button>
      </div>
    </div>
  );
}

export default QuestionForm;
