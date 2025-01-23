"use client";
import React, { useState, useTransition } from "react";
import { formSchema } from "./schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/app/_components/ui/form";
import { Textarea } from "@/app/_components/ui/textarea";
import { Button } from "@/app/_components/ui/button";
import { callOpenAI } from "@/app/_services/https/open-ia-service/openIaService";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { addQuestions } from "@/app/_services/https/question-service/questionService";
import { toast } from "sonner";

type Option = {
  description?: string | null;
  text: string;
  isCorrect: boolean;
};

type Question = {
  text: string;
  type: "MULTIPLE_CHOICE" | "SINGLE_CHOICE";
  options: Option[];
};

interface QuestionFormIAProps {
  moduleId: string;
  setIsOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

function QuestionFormIA({
  moduleId,
  setIsOpenDialog,
}: QuestionFormIAProps) {
  const [isPending, startTransition] = useTransition();
  const [isPendingAdd, startTransitionAdd] = useTransition();
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleSubmit = (formData: z.infer<typeof formSchema>) => {
    startTransition(() => {
      callOpenAI(`usando esse prompt: "${formData.prompt}". Gere um array de questões no formato JSON válido. Cada questão deve seguir exatamente este padrão:
        [
          {
            "text": "titulo aqui",
            "type": "SINGLE_CHOICE" ou "MULTIPLE_CHOICE",
            "options": [
              {
                "text": "texto da opcao",
                "isCorrect": boolean se é a correta
              },
              {
                "text": "texto da opcao",
                "isCorrect": boolean se é a correta
              },
               {
                "text": "texto da opcao",
                "isCorrect": boolean se é a correta
              },
             {
                "text": "texto da opcao",
                "isCorrect": boolean se é a correta
              },
            ]
          }
        ]
        Esse prompt esta dentro de um parse, nao mande em markdown. O numero máximo de questões é 5`)
        .then((result) => {
          if (!result) {
            return alert(
              "Precisamos de um prompt melhor para realizar a criação. Siga o exemplo do campo",
            );
          }

          setQuestions(JSON.parse(result));
        })
        .catch((error) => console.error(error));
    });
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const removeQuestion = (index: number) => {
    setQuestions((olds) => olds.filter((_, i) => i !== index));
  };

  const handleAddQuestions = () => {
    startTransitionAdd(async () => {
      try {
        await addQuestions(questions, moduleId);
        setIsOpenDialog(false);
        toast("Questões adicionadas com sucesso!");
      } catch (e) {
        console.log(e);
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col items-end justify-end gap-1">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="mb-4 w-full">
                  <FormControl>
                    <Textarea
                      className={`font-inter rounded-[4px] border-gray-300 text-sm font-[400] focus:border-gray-600 ${
                        field.value?.trim() && "border-gray-600"
                      }`}
                      placeholder="EX: 5 questões de história sobre a segunda guerra mundial"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isPending}
              type="submit"
              className="flex w-full items-center justify-center"
            >
              {isPending ? (
                <AiOutlineLoading3Quarters
                  size={24}
                  color="inherit"
                  className="animate-spin"
                />
              ) : (
                "Gerar quesões"
              )}
              {isPending && " Gerando"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-6 space-y-2">
        {questions.map((question, index) => (
          <div
            key={question.text + index}
            className="flex items-center justify-between gap-2 rounded-lg rounded-t-lg bg-zinc-400/10 px-4 py-2 outline-none hover:bg-zinc-100/10 [&[data-state=open]]:rounded-b-none"
          >
            <h2>
              {index + 1} - {question.text}
            </h2>
            <Button onClick={() => removeQuestion(index)}>
              <IoClose />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-end">
        <Button
          disabled={isPendingAdd || questions.length === 0}
          className="flex w-full items-center justify-center"
          onClick={handleAddQuestions}
        >
          {isPendingAdd ? (
            <AiOutlineLoading3Quarters
              size={24}
              color="inherit"
              className="animate-spin"
            />
          ) : (
            "Adicionar"
          )}
          {isPendingAdd && " Adicionando..."}
        </Button>
      </div>
    </>
  );
}

export default QuestionFormIA;
