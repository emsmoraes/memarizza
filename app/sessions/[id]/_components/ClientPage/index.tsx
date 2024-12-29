"use client";

import React, { useReducer, useState } from "react";
import { Prisma } from "@prisma/client";
import QuestionNumberCard from "../QuestionNumberCard";
import QuestionForm from "../QuestionForm";

interface ClientPageProps {
  questions: Prisma.QuestionGetPayload<{
    include: {
      options: true;
    };
  }>[];
}

type State = {
  currentQuestionIndex: number;
  answers: Record<string, string[]>;
};

type Action =
  | { type: "SET_CURRENT_QUESTION"; payload: number }
  | { type: "ANSWER_QUESTION"; payload: { questionId: string; answers: string[] } };

const initialState: State = {
  currentQuestionIndex: 0,
  answers: {},
};

function quizReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_CURRENT_QUESTION":
      return {
        ...state,
        currentQuestionIndex: action.payload,
      };
    case "ANSWER_QUESTION":
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.answers,
        },
      };
    default:
      return state;
  }
}

function ClientPage({ questions }: ClientPageProps) {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const [saved, setSaved] = useState(false);

  const currentQuestion = questions[state.currentQuestionIndex];

  const handleCurrentQuestion = (id: string) => {
    const index = questions.findIndex((q) => q.id === id);
    if (index !== -1) {
      dispatch({ type: "SET_CURRENT_QUESTION", payload: index });
    }
  };

  const handleAnswer = (questionId: string, answers: string[]) => {
    dispatch({ type: "ANSWER_QUESTION", payload: { questionId, answers } });
  };

  const nextQuestion = () => {
    if (state.currentQuestionIndex < questions.length - 1) {
      dispatch({
        type: "SET_CURRENT_QUESTION",
        payload: state.currentQuestionIndex + 1,
      });
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="mb-3 flex w-full flex-wrap gap-2 rounded-2xl bg-accent-foreground/5 p-4">
        {questions.map((quest, i) => (
          <QuestionNumberCard
            isActive={state.currentQuestionIndex === i}
            id={quest.id}
            position={i + 1}
            key={quest.id}
            onClick={handleCurrentQuestion}
          />
        ))}
      </div>

      {currentQuestion && (
        <QuestionForm
          currentQuestion={currentQuestion}
          currentAnswer={state.answers[currentQuestion.id] || []}
          handleAnswer={handleAnswer}
          handleNextQuestion={nextQuestion}
        />
      )}
    </div>
  );
}

export default ClientPage;
