/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import styles from "./styles.module.css";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsFileEarmarkText } from "react-icons/bs";
import { removeQuestion } from "@/app/_services/https/question-service/questionService";
import { Prisma } from "@prisma/client";
import UpdateQuestionForm from "../UpdateQuestionForm";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent } from "@/app/_components/ui/tabs";

interface QuestionCardCardProps {
  question: Prisma.QuestionGetPayload<{
    include: {
      options: true;
      module: true
    };
  }>;
}

function formatQuestionForForm(
  question: Prisma.QuestionGetPayload<{
    include: {
      options: true;
      module: true
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

function QuestionCard({ question }: QuestionCardCardProps) {
  const [deletingQuestion, setDeletingQuestion] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { data } = useSession();

  const handleCardClick = () => {
    setShowDetailsDialog(true);
  };

  const handleDeleteQuestion = async () => {
    setDeletingQuestion(true);

    try {
      await removeQuestion(question.id);
      toast("Questão excluída com sucesso");
    } catch (error) {
      console.log(error);
      toast("Erro ao excluír questão");
    } finally {
      setDeletingQuestion(true);
    }
  };

  function removeHtmlAndImages(input: string): string {
    let result = input.replace(/<img[^>]*>/g, "");

    result = result.replace(/<\/?[^>]+(>|$)/g, "");

    return result;
  }

  return (
    <>
      <Dialog>
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

          <DialogTrigger
            asChild
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <button
              className="absolute right-2 top-2 hidden p-1 text-white opacity-50 transition-transform duration-200 hover:scale-110 hover:opacity-100 group-hover:block"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <FiTrash2 className="text-base" />
            </button>
          </DialogTrigger>
        </div>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Tem certeza que deseja excluir a questão &quot;
              {removeHtmlAndImages(question.text)}
              &quot;?
            </DialogTitle>
            <DialogDescription>Essa ação é irreversível</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              onClick={handleDeleteQuestion}
              type="button"
              variant="destructive"
              className="mb-2 mt-2 w-full sm:mb-0 sm:mt-0 sm:w-[95px]"
            >
              {deletingQuestion ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent
          className={`m-auto max-h-[80vh] translate-x-[-50%] translate-y-[-50%] overflow-x-auto pt-10 sm:max-w-[600px]`}
        >
          <Tabs defaultValue="question">
            <TabsContent value="question">
              <UpdateQuestionForm
                data={data}
                initialData={formatQuestionForForm(question)}
                questionId={question.id}
                setIsOpenDialog={setShowDetailsDialog}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default QuestionCard;
