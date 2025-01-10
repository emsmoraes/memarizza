// question.model.ts

export enum QuestionType {
    MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
    SINGLE_CHOICE = "SINGLE_CHOICE",
}

export interface Question {
    id: string;
    text: string;
    type: QuestionType;
    module: Module;
    options: Option[];
    answer: Answer;
}

export interface Module {
    id: string;
    title: string;
    description: string;
}

export interface Option {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface CorrectAnswer {
    id: string;
    text: string;
}

export interface Answer {
    id: string;
    questionId: string;
    selectedOptionId: string;
}
