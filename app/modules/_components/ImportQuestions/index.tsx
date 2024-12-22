"use client";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import {
  cloneQuestionsToModule,
  searchQuestionsByTextAndModule,
} from "@/app/_services/https/question-service/questionService";
import { DialogTrigger } from "@radix-ui/react-dialog";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";
import { LuImport } from "react-icons/lu";
import { Prisma } from "@prisma/client";
import SearchQuestionCard from "../SearchQuestionCard";
import { toast } from "sonner";

function ImportQuestions({ moduleId }: { moduleId: string }) {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState("");
  const [questions, setQuestions] = useState<
    Prisma.QuestionGetPayload<{
      include: {
        options: true;
        module: true;
      };
    }>[]
  >([]);
  const [selectedQuestionsIds, setSelectedQuestionsIds] = useState<string[]>(
    [],
  );
  const [isPendingAddingQuestions, startTransitionAddingQuestions] =
    useTransition();

  const handleToggleQuestionId = (questionId: string) => {
    setSelectedQuestionsIds((olds) =>
      olds.includes(questionId)
        ? olds.filter((id) => id !== questionId)
        : [...olds, questionId],
    );
  };

  const handleClearSelectedQuestions = () => {
    setSelectedQuestionsIds([]);
  };

  const handleAddQuestions = () => {
    startTransitionAddingQuestions(async () => {
      try {
        await cloneQuestionsToModule(selectedQuestionsIds, moduleId);
        setIsOpenDialog((old) => {
          return !old;
        });
        toast("Adicionado(s) com sucesso!");
        setQuestions((prevQuestions) =>
          prevQuestions.filter(
            (question) => !selectedQuestionsIds.includes(question.id),
          ),
        );
        handleClearSelectedQuestions()
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erro ao adicionar. Tente novamente mais tarde.";
        toast(errorMessage);
      }
    });
  };

  const debounce = <T extends (...args: string[]) => void>(
    cb: T,
    delay: number = 1000,
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: Parameters<T>) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        timeout = null;
        cb(...args);
      }, delay);
    };
  };

  const onInput = (searchValue: string): void => {
    setSearchValue(searchValue);
  };

  const onInputWithDebouncing = useCallback(debounce(onInput, 1000), []);

  const searchQuestions = useCallback(() => {
    startTransition(async () => {
      const questionsData = await searchQuestionsByTextAndModule(
        searchValue,
        moduleId,
      );
      setQuestions(questionsData ?? []);
    });
  }, [searchValue]);

  useEffect(() => {
    searchQuestions();
  }, [searchQuestions]);

  return (
    <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="border-2">
          <LuImport />
          Importar
        </Button>
      </DialogTrigger>

      <DialogContent
        className={`h-[500px] max-h-[80vh] overflow-x-auto pt-10 sm:max-w-[825px]`}
      >
        <div className="space-y-4">
          <DialogTitle>Importar questões</DialogTitle>
          <DialogDescription>
            Importe uma ou mais questoes para o modulo
          </DialogDescription>

          <div className="relative flex items-center">
            {isPending ? (
              <AiOutlineLoading3Quarters className="absolute left-4 h-6 w-6 animate-spin" />
            ) : (
              <IoSearch className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 transform" />
            )}
            <input
              onChange={(e) => onInputWithDebouncing(e.target.value)}
              placeholder="Busque questões ou modulos"
              className="lex w-full rounded-lg border border-input bg-transparent py-3 pl-12 text-lg shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {questions.map((question) => (
            <SearchQuestionCard
              question={question}
              key={question.id}
              isSelected={selectedQuestionsIds.includes(question.id)}
              handleToggleQuestionId={handleToggleQuestionId}
            />
          ))}
        </div>
        <DialogFooter>
          <Button
            variant={"destructive"}
            onClick={() => {
              setIsOpenDialog(false);
              handleClearSelectedQuestions();
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAddQuestions}
            disabled={isPendingAddingQuestions}
          >
            {isPendingAddingQuestions ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              `Adicionar${selectedQuestionsIds.length > 0 ? ` (${selectedQuestionsIds.length})` : ""}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ImportQuestions;
