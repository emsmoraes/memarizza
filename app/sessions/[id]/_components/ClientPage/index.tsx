"use client";
import React, { useState } from "react";
import { Prisma } from "@prisma/client";
import QuestionNumberCard from "../QuestionNumberCard";
import QuestionForm from "../QuestionForm";
import { Button } from "@/app/_components/ui/button";

interface ClientPageProps {
  questions: Prisma.QuestionGetPayload<{
    include: {
      options: true;
    };
  }>[];
}

function ClientPage({ questions }: ClientPageProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleCurrentQuestion = (id: string) => {
    const index = questions.findIndex((q) => q.id === id);
    if (index !== -1) setCurrentQuestionIndex(index);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const backQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const currentQuestionSelected = questions[currentQuestionIndex];

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="mb-3 flex w-full flex-wrap gap-2 rounded-2xl bg-accent-foreground/5 p-4">
        {questions.map((quest, i) => (
          <QuestionNumberCard
            isActive={currentQuestionIndex === i}
            id={quest.id}
            position={i + 1}
            key={quest.id}
            onClick={handleCurrentQuestion}
          />
        ))}
      </div>

      {currentQuestionSelected && (
        <QuestionForm
          currentQuestion={currentQuestionSelected}
          position={currentQuestionIndex}
          handleNextQuestion={nextQuestion}
        />
      )}
    </div>
  );
}

export default ClientPage;
