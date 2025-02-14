import { Prisma } from ".prisma/client";

type State = {
    currentQuestionIndex: number;
    answers: Record<string, string[]>;
    revealed: Record<string, boolean>;
  };

export const mapQuestionsToState = (
  questions: Prisma.QuestionGetPayload<{
    include: {
      options: true;
      answer: true;
    };
  }>[],
): State => {
  const answers: Record<string, string[]> = {};
  const revealed: Record<string, boolean> = {};

  questions.forEach((question) => {
    if (question.answer) {
      const answer = question.answer.answer;
      answers[question.id] =
        typeof answer === "string" ? answer.split(",") : [answer];
    }

    revealed[question.id] = false;
  });

  return {
    currentQuestionIndex: 0,
    answers,
    revealed,
  };
};