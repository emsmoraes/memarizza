// store/quizReducer.ts
export type State = {
  currentQuestionIndex: number;
  answers: Record<string, string[]>;
  revealed: Record<string, boolean>;
};

export type Action =
  | { type: "SET_CURRENT_QUESTION"; payload: number }
  | {
      type: "ANSWER_QUESTION";
      payload: { questionId: string; answers: string[] };
    }
  | {
      type: "SET_QUESTION_REVEAL";
      payload: { questionId: string; reveal: boolean };
    }
  | { type: "SET_ALL_QUESTIONS_REVEAL"; payload: { reveal: boolean } }
  | { type: "CLEAR_ALL_ANSWERS" };

export function quizReducer(state: State, action: Action): State {
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
    case "SET_QUESTION_REVEAL":
      return {
        ...state,
        revealed: {
          ...state.revealed,
          [action.payload.questionId]: action.payload.reveal,
        },
      };
    case "SET_ALL_QUESTIONS_REVEAL": {
      const { reveal } = action.payload;
      const updatedRevealed = Object.keys(state.revealed).reduce(
        (acc, questionId) => {
          acc[questionId] = reveal;
          return acc;
        },
        {} as Record<string, boolean>,
      );
      return {
        ...state,
        revealed: updatedRevealed,
      };
    }
    case "CLEAR_ALL_ANSWERS": {
      const clearedAnswers = Object.keys(state.answers).reduce(
        (acc, questionId) => {
          acc[questionId] = [];
          return acc;
        },
        {} as Record<string, string[]>,
      );
      return {
        ...state,
        answers: clearedAnswers,
      };
    }
    default:
      return state;
  }
}
