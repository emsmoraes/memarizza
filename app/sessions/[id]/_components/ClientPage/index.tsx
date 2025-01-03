"use client";

import React, { useReducer, useState, useTransition } from "react";
import { Prisma } from "@prisma/client";
import QuestionNumberCard from "../QuestionNumberCard";
import QuestionForm from "../QuestionForm";
import { addOrUpdateAnswersInSession } from "@/app/_services/https/answer-service/answerService";
import { useSession } from "next-auth/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface ClientPageProps {
  questions: Prisma.QuestionGetPayload<{
    include: {
      options: true;
      answers: true;
    };
  }>[];
  sessionId: string;
}

type State = {
  currentQuestionIndex: number;
  answers: Record<string, string[]>;
};

type Action =
  | { type: "SET_CURRENT_QUESTION"; payload: number }
  | {
      type: "ANSWER_QUESTION";
      payload: { questionId: string; answers: string[] };
    };

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

function ClientPage({ questions, sessionId }: ClientPageProps) {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(true);

  const { data } = useSession();

  const user = data?.user;

  if (!user) {
    return null;
  }

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

  const saveProgress = async () => {
    startTransition(async () => {
      try {
        await addOrUpdateAnswersInSession(sessionId, user.id, state.answers);
        setSaved(true);
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex w-full flex-1 gap-2 rounded-2xl bg-accent-foreground/5 p-4">
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
        <button
          onClick={saveProgress}
          className="hover:text-secondary-light flex h-full w-[157px] items-center justify-center gap-2 rounded-2xl bg-foreground p-4 font-medium text-secondary transition duration-300 hover:bg-foreground/90"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <AiOutlineLoading3Quarters className="h-5 w-5 animate-spin text-secondary" />
              Salvando...
            </>
          ) : (
            "Salvar progresso"
          )}
        </button>
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
