/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
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
import FormOptionCard from "../FormOptionCard";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
} from "@hello-pangea/dnd";
import { QuestionType } from "@/app/_models/question.model";
import { formSchema } from "./schema";
import { Button } from "@/app/_components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface DisabledQuestionFormProps {
  initialData: any;
  isPendingAddingQuestions: boolean;
  isSelected: boolean;
  handleToggleQuestionId: () => void;
}

function DisabledQuestionForm({
  initialData,
  isPendingAddingQuestions,
  handleToggleQuestionId,
  isSelected,
}: DisabledQuestionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const options = form.watch("options");
  const questionType = form.watch("questionType");

  const onDragEnd = () => {};

  return (
    <Form {...form}>
      <DialogHeader className="mb-3 mt-3">
        <DialogTitle>Visualizar questão</DialogTitle>
        <DialogDescription>
          Importe a questão para edita-la dentro do seu modulo
        </DialogDescription>
      </DialogHeader>

      <form>
        <FormField
          control={form.control}
          name="questionTitle"
          render={({ field }) => (
            <FormItem className="mb-4 w-full">
              <FormLabel>Título da questão</FormLabel>
              <FormControl>
                <RichText
                  content={field.value}
                  onChange={field.onChange}
                  readOnly
                />
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
                <Select disabled value={field.value}>
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
            <FormLabel>Opções</FormLabel>
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
                        readOnly
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
            type="button"
            className="flex w-full items-center justify-center"
            onClick={handleToggleQuestionId}
            disabled={isPendingAddingQuestions}
          >
            {isPendingAddingQuestions ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : isSelected ? (
              "Remover"
            ) : (
              "Adicionar ao módulo"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default DisabledQuestionForm;
