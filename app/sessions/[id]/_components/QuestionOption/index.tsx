"use client";
import { ALPHABET } from "@/app/_models/alphabet.model";
import React, { useState } from "react";
import { PiEye } from "react-icons/pi";

interface QuestionOptionProps {
  option: {
    id: string;
    text: string;
    questionId: string;
    description: string | null;
    isCorrect: boolean;
  };
  handleOptionClick: (optionId: string) => void;
  currentAnswer: string[];
  index: number;
}

function QuestionOption({
  option,
  handleOptionClick,
  currentAnswer,
  index
}: QuestionOptionProps) {
  const [openDescription, setOpenDescription] = useState(false);

  const toggleDescription = () => {
    setOpenDescription((prev) => !prev);
  };
  return (
    <div
      key={option.id}
      onClick={() => handleOptionClick(option.id)}
      className={`relative flex w-full cursor-pointer gap-2 rounded-xl border border-solid ${
        currentAnswer.includes(option.id)
          ? "border-foreground bg-muted-foreground/30"
          : "bg-muted-foreground/20 duration-200 hover:bg-foreground/15"
      }`}
    >
      <div className="flex min-h-full justify-center rounded-l-xl border-r-2 border-solid border-background px-5">
        <span className="my-4 block text-2xl font-semibold">{ALPHABET[index]}</span>
      </div>
      <div className="w-full px-3 py-4 pr-10">
        <div className="flex w-full gap-3">
          <span className="block">
            <div
              className="block [&>img]:h-auto [&>img]:max-w-[400px] text-lg"
              dangerouslySetInnerHTML={{ __html: option.text }}
            /> 
          </span>
        </div>
        <button
        disabled={!option.description}
          className="absolute right-4 top-4 disabled:text-zinc-500"
          onClick={(e) => {
            e.stopPropagation();
            toggleDescription();
          }}
        >
          <PiEye size={20} />
        </button>
        {openDescription && (
          <div className="mt-8 flex w-full items-center justify-center rounded-md border border-solid border-foreground px-2 py-4">
            {option.description}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionOption;
