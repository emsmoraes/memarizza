"use client";

import React, { useReducer, useState, useTransition } from "react";
import { Prisma } from "@prisma/client";
import QuestionNumberCard from "../QuestionNumberCard";
import QuestionForm from "../QuestionForm";
import { addOrUpdateAnswersInSession } from "@/app/_services/https/answer-service/answerService";
import { useSession } from "next-auth/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import SaveIndicator from "../SaveIndicator";
import SessionConfig from "../SessionConfig";
import { quizReducer } from "@/app/store/quizReducer";
import { mapQuestionsToState } from "../../utils/formatQuestions";

interface ClientPageProps {
  questions: Prisma.QuestionGetPayload<{
    include: {
      options: true;
      answer: true;
    };
  }>[];
  sessionId: string;
}

function ClientPage({ questions, sessionId }: ClientPageProps) {
  const [state, dispatch] = useReducer(
    quizReducer,
    mapQuestionsToState(questions),
  );
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | "unsaved">(
    "saved",
  );
  const allRevealed = Object.values(state.revealed).every(Boolean);
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
    setSaveStatus("unsaved");
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
      setSaveStatus("saving");
      try {
        await addOrUpdateAnswersInSession(sessionId, user.id, state.answers);
        setSaveStatus("saved");
      } catch (error) {
        console.error(error);
      }
    });
  };

  const toggleReveal = (questionId: string) => {
    dispatch({
      type: "SET_QUESTION_REVEAL",
      payload: {
        questionId,
        reveal: !state.revealed[questionId],
      },
    });
  };

  const clearAllAnswers = () => {
    setSaveStatus("unsaved");
    dispatch({ type: "CLEAR_ALL_ANSWERS" });
  };

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex w-full flex-1 gap-2 rounded-2xl bg-accent-foreground/5 p-4">
          {questions.map((quest, i) => (
            <QuestionNumberCard
              currentAnswer={state.answers[quest.id] || []}
              isActive={state.currentQuestionIndex === i}
              id={quest.id}
              position={i + 1}
              key={quest.id}
              onClick={handleCurrentQuestion}
            />
          ))}
        </div>
        <div className="flex h-full items-center gap-2">
          <SaveIndicator saveStatus={saveStatus} />
          <button
            onClick={saveProgress}
            className="hover:text-secondary-light flex h-full w-[157px] items-center justify-center gap-2 rounded-2xl bg-foreground p-4 font-medium text-secondary transition duration-300 hover:bg-foreground/90 disabled:bg-foreground/60"
            disabled={saveStatus !== "unsaved"}
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
          <SessionConfig
            clearAllAnswers={clearAllAnswers}
            allRevealed={allRevealed}
            toggleAllReveal={(reveal: boolean) =>
              dispatch({
                type: "SET_ALL_QUESTIONS_REVEAL",
                payload: { reveal },
              })
            }
          />
        </div>
      </div>

      {currentQuestion && (
        <QuestionForm
          currentQuestion={currentQuestion}
          currentAnswer={state.answers[currentQuestion.id] || []}
          handleAnswer={handleAnswer}
          handleNextQuestion={nextQuestion}
          isLast={state.currentQuestionIndex + 1 === questions.length}
          position={state.currentQuestionIndex + 1}
          isRevealed={state.revealed[currentQuestion.id] || false}
          toggleReveal={() => toggleReveal(currentQuestion.id)}
        />
      )}
    </div>
  );
}

export default ClientPage;
