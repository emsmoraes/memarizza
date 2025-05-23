/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useTransition } from "react";
import { Button } from "@/app/_components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Session } from "next-auth";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import RichText from "@/app/_components/form/RichText";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { FaRegCheckSquare } from "react-icons/fa";
import { MdRadioButtonChecked } from "react-icons/md";
import { Separator } from "@/app/_components/ui/separator";
import { FiPlusCircle } from "react-icons/fi";
import FormOptionCard from "../FormOptionCard";
import { v4 as uuidv4 } from "uuid";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
} from "@hello-pangea/dnd";
import { QuestionType } from "@/app/_models/question.model";
import { toast } from "sonner";
import { updateQuestion } from "@/app/_services/https/question-service/questionService";
import { formSchema } from "./schema";

interface UpdateQuestionFormProps {
  data: Session | null;
  setIsOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  initialData: any;
  questionId: string;
}

function UpdateQuestionForm({
  data,
  setIsOpenDialog,
  questionId,
  initialData,
}: UpdateQuestionFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const addOption = () => {
    const currentOptions = form.watch("options") ?? [];

    const newOption = {
      id: uuidv4(),
      text: `Opção ${currentOptions.length + 1}`,
      isCorrect: false,
    };

    form.setValue("options", [...currentOptions, newOption]);
  };

  const options = form.watch("options");
  const questionType = form.watch("questionType");

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const options = form.getValues("options") ?? [];
    const reorderedOptions = reorder(
      options,
      result.source.index,
      result.destination.index,
    );

    form.setValue("options", reorderedOptions);
  };

  function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  const handleSubmit = (formData: z.infer<typeof formSchema>) => {
    if (data && data.user) {
      const options = formData.options.map((option: any) => ({
        text: option.text,
        isCorrect: option.isCorrect,
        description: option.description,
      }));

      console.log(options)

      const payload = {
        type: formData.questionType as QuestionType,
        text: formData.questionTitle,
        options: {
          create: options,
        },
      };
      startTransition(async () => {
        try {
          await updateQuestion(questionId, payload);
          setIsOpenDialog((old) => {
            return !old;
          });
          toast("Questão editada com sucesso!");
          form.reset();
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Erro ao editar. Tente novamente mais tarde.";
          toast(errorMessage);
        }
      });
    }
  };

  return (
    <Form {...form}>
      <DialogHeader className="mb-3 mt-3">
        <DialogTitle>Editar questão</DialogTitle>
        <DialogDescription>
          Ao editar uma questão, todas as respostas dela serão deletadas
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="questionTitle"
          render={({ field }) => (
            <FormItem className="mb-4 w-full">
              <FormLabel>Título da questão</FormLabel>
              <FormControl>
                <RichText content={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="mb-4" />

        <FormField
          control={form.control}
          name="questionType"
          render={({ field }) => (
            <FormItem className="mb-4 w-full">
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tipo de questão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SINGLE_CHOICE">
                      <div className="flex items-center gap-2">
                        <MdRadioButtonChecked className="mr-2" /> Escolha única
                      </div>
                    </SelectItem>
                    <SelectItem value="MULTIPLE_CHOICE">
                      <div className="flex items-center gap-2">
                        <FaRegCheckSquare className="mr-2" /> Multipla escolha
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <>
          <div>
            <FormLabel>Adicionar opções</FormLabel>
            <Button onClick={addOption} type="button" className="ml-4">
              <FiPlusCircle />
            </Button>
            {form.formState.errors.options && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {form.formState.errors.options.message}
              </p>
            )}
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable-queue">
              {(provided: DroppableProvided) => (
                <div
                  className="mt-3"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {(options ?? []).map((option, index) => {
                    const error = form.formState.errors?.options?.[index];

                    return (
                      <FormOptionCard
                        option={option}
                        key={option.id}
                        error={error}
                        index={index}
                        questionType={questionType as QuestionType}
                      />
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </>

        <div className="mt-11 flex items-end justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-[90px]"
          >
            {isPending ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              "Salvar"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default UpdateQuestionForm;
