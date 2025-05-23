"use client";
import { Prisma } from ".prisma/client";
import { Button } from "@/app/_components/ui/button";
import React from "react";
import QuestionOption from "../QuestionOption";
import { HiMiniArrowRight } from "react-icons/hi2";
import { Switch } from "@/app/_components/ui/switch";
import { Label } from "@/app/_components/ui/label";

interface QuestionFormProps {
  currentQuestion: Prisma.QuestionGetPayload<{
    include: {
      options: true;
    };
  }>;
  currentAnswer: string[];
  handleAnswer: (questionId: string, answers: string[]) => void;
  handleNextQuestion: () => void;
  isLast: boolean;
  position: number;
  toggleReveal: () => void;
  isRevealed: boolean;
}

function QuestionForm({
  currentQuestion,
  currentAnswer,
  handleAnswer,
  handleNextQuestion,
  isLast,
  position,
  toggleReveal,
  isRevealed,
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
      <div className="flex flex-row items-center justify-end gap-3 p-3">
        <div className="space-y-0.5">
          <Label htmlFor="reval">
            Revelar{" "}
            {currentQuestion.type === "SINGLE_CHOICE"
              ? "resposta"
              : "respostas"}
          </Label>
        </div>
        <Switch
          id="reval"
          checked={isRevealed}
          onCheckedChange={() => {
            toggleReveal();
          }}
        />
      </div>
      <h1 className="mb-6 flex items-center gap-2 text-xl">
        {position}
        <span className="block text-xs">
          {currentQuestion.type === "MULTIPLE_CHOICE"
            ? "(Multipla)"
            : "(Única)"}{" "}
          -
        </span>
        <div
          className="block [&>img]:h-auto [&>img]:max-w-[400px]"
          dangerouslySetInnerHTML={{ __html: currentQuestion.text }}
        />
      </h1>

      <div className="space-y-5">
        {currentQuestion.options.map((option, i) => (
          <QuestionOption
            currentAnswer={currentAnswer}
            handleOptionClick={handleOptionClick}
            index={i}
            option={option}
            key={option.id}
            isRevealed={isRevealed && option.isCorrect}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        {!isLast && (
          <Button
            onClick={handleNextQuestion}
            className="hover:text-secondary-light flex h-full w-[157px] items-center justify-center gap-2 rounded-2xl bg-foreground p-4 font-medium text-secondary transition duration-300 hover:bg-foreground/90 disabled:bg-foreground/60 [&_svg]:size-6"
          >
            <div className="flex items-center gap-2 text-[17px]">
              Proxima
              <HiMiniArrowRight />
            </div>
          </Button>
        )}
      </div>
    </div>
  );
}

export default QuestionForm;
