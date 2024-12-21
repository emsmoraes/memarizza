"use client";
import { Prisma } from ".prisma/client";
import { Button } from "@/app/_components/ui/button";
import { ALPHABET } from "@/app/_models/alphabet.model";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  answers: z
    .array(
      z.object({
        id: z.string().min(1, "O id da opção é obrigatório"),
      }),
    )
    .min(1, "É necessário pelo menos uma resposta"),
});

interface QuestionFormProps {
  currentQuestion: Prisma.QuestionGetPayload<{
    include: {
      options: true;
    };
  }>;
  position: number;
  handleNextQuestion: () => void;
}

function QuestionForm({
  currentQuestion,
  handleNextQuestion,
}: QuestionFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: [],
    },
  });

  const selectedAnswers = watch("answers");

  const handleOptionClick = (optionId: string) => {
    const isMultiple = currentQuestion.type === "MULTIPLE_CHOICE";
  
    const alreadySelected = selectedAnswers.find(
      (answer) => answer.id === optionId,
    );
  
    if (isMultiple) {
      if (alreadySelected) {
        setValue(
          "answers",
          selectedAnswers.filter((answer) => answer.id !== optionId),
        );
      } else {
        setValue("answers", [...selectedAnswers, { id: optionId }]);
      }
    } else {
      if (!alreadySelected) {
        setValue("answers", [{ id: optionId }]);
      }
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Submitted data:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-1 flex-col rounded-2xl bg-accent-foreground/5 p-4"
    >
      <h1 className="mb-2 text-lg">
        <div
          className="block [&>img]:h-auto [&>img]:max-w-[400px]"
          dangerouslySetInnerHTML={{ __html: currentQuestion.text }}
        />
      </h1>

      {errors.answers && (
        <p className="mb-5 text-sm text-red-500">{errors.answers.message}</p>
      )}

      <div className="space-y-3">
        {currentQuestion.options.map((option, i) => (
          <div
            onClick={() => handleOptionClick(option.id)}
            className="w-full rounded-xl bg-muted-foreground/20 p-2"
            key={option.id}
          >
            <div className="flex gap-3">
              <span className="block">{ALPHABET[i]})</span>
              <span className="block">
                <div
                  className="block [&>img]:h-auto [&>img]:max-w-[400px]"
                  dangerouslySetInnerHTML={{ __html: option.text }}
                />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button className="h-10 w-10 rounded-full p-0 text-xl">&gt;</Button>
      </div>
    </form>
  );
}

export default QuestionForm;
