/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import styles from "./styles.module.css";
import { Dialog, DialogContent } from "@/app/_components/ui/dialog";
import { BsFileEarmarkText } from "react-icons/bs";
import { Prisma } from "@prisma/client";
import { Tabs, TabsContent } from "@/app/_components/ui/tabs";
import DisabledQuestionForm from "../DisabledQuestionForm";
import { IoCloseOutline } from "react-icons/io5";

interface SearchQuestionCardCardProps {
  isSelected: boolean;
  handleToggleQuestionId: (questionId: string) => void;
  isPendingAddingQuestions: boolean;
  question: Prisma.QuestionGetPayload<{
    include: {
      options: true;
      module: true;
    };
  }>;
}

function formatQuestionForForm(
  question: Prisma.QuestionGetPayload<{
    include: {
      options: true;
      module: true;
    };
  }>,
) {
  return {
    questionTitle: question.text,
    questionType: question.type,
    options: question.options?.map((option) => ({
      id: option.id,
      text: option.text,
      isCorrect: option.isCorrect,
      description: option.description,
    })),
  };
}

function SearchQuestionCard({
  question,
  handleToggleQuestionId,
  isSelected,
  isPendingAddingQuestions
}: SearchQuestionCardCardProps) {
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const handleCardClick = () => {
    setShowDetailsDialog(true);
  };

  function removeHtmlAndImages(input: string): string {
    let result = input.replace(/<img[^>]*>/g, "");

    result = result.replace(/<\/?[^>]+(>|$)/g, "");

    return result;
  }

  return (
    <>
      <div
        key={question.id}
        className={`${styles.glassEffect} group relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg p-4 shadow-lg transition-all duration-200 hover:scale-105`}
        onClick={handleCardClick}
      >
        <div className="text-center">
          <BsFileEarmarkText className="text-2xl" />
        </div>
        <div className="mt-2 line-clamp-2 w-full">
          <p className="line-clamp-2 w-full break-words text-center text-base font-semibold">
            {removeHtmlAndImages(question.text)}
          </p>
          <p className="w-full break-words text-center text-xs">
            {question.module.name}
          </p>
        </div>

        <button
          className={`absolute right-2 top-2 hidden p-1 text-foreground ${
            isSelected ? "" : "opacity-50 hover:opacity-100"
          } transition-transform duration-200 hover:scale-110 group-hover:block`}
          onClick={(e) => {
            e.stopPropagation();
            handleToggleQuestionId(question.id);
          }}
        >
          {isSelected ? (
            <IoCloseOutline className="text-base text-red-500" />
          ) : (
            <FiPlus className="text-base" />
          )}
        </button>
      </div>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent
          className={`m-auto max-h-[80vh] translate-x-[-50%] translate-y-[-50%] overflow-x-auto pt-10 sm:max-w-[600px]`}
        >
          <Tabs defaultValue="question">
            <TabsContent value="question">
              <DisabledQuestionForm
                isPendingAddingQuestions={isPendingAddingQuestions}
                initialData={formatQuestionForForm(question)}
                handleToggleQuestionId={() => {
                  handleToggleQuestionId(question.id);
                  setShowDetailsDialog(false);
                }}
                isSelected={isSelected}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SearchQuestionCard;
