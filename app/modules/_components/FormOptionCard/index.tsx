/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/_components/ui/accordion";
import { cn } from "@/lib/utils";
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  useFormContext,
} from "react-hook-form";
import { Button } from "@/app/_components/ui/button";
import { Check, X } from "lucide-react";
import RichText from "@/app/_components/form/RichText";
import { Draggable, DraggableProvided } from "@hello-pangea/dnd";
import { RiDraggable } from "react-icons/ri";
import { QuestionType } from "@/app/_models/question.model";
import { ALPHABET } from "@/app/_models/alphabet.model";

interface FormOptionCardProps {
  index: number;
  questionType: QuestionType;
  option: {
    id: string;
    text: string;
    isCorrect: boolean;
  };
  error:
    | Merge<
        FieldError,
        FieldErrorsImpl<{
          id: string;
          text: string;
          isCorrect: boolean;
        }>
      >
    | undefined;
}

function FormOptionCard({
  option,
  error,
  index,
  questionType,
}: FormOptionCardProps) {
  const { setValue, getValues } = useFormContext();
  const [newText, setNewText] = useState(option.text);
  const [openAccordion, setOpenAccordion] = useState(false);

  const handleTextChange = () => {
    if (newText.length <= 5) {
      return null;
    }

    const options = getValues("options");
    const updatedOptions = options.map((opt: any) =>
      opt.id === option.id ? { ...opt, text: newText } : opt,
    );
    setValue("options", updatedOptions);

    setOpenAccordion(false);
  };

  const triggerClassName = cn("bg-zinc-100/10 rounded-lg px-4 outline-none", {
    "bg-red-600/50 hover:bg-red-500/50": !!error,
    "hover:bg-zinc-100/10": !error,
  });

  const toggleCorrect = () => {
    const options = getValues("options");

    if (questionType === "SINGLE_CHOICE") {
      const updatedOptions = options.map((opt: any) => ({
        ...opt,
        isCorrect: opt.id === option.id ? true : false,
      }));
      setValue("options", updatedOptions);
    } else if (questionType === "MULTIPLE_CHOICE") {
      const updatedOptions = options.map((opt: any) =>
        opt.id === option.id ? { ...opt, isCorrect: !opt.isCorrect } : opt,
      );
      setValue("options", updatedOptions);
    }
  };

  const handleDeleteOption = () => {
    const options = getValues("options");
    const updatedOptions = options.filter((opt: any) => opt.id !== option.id);
    setValue("options", updatedOptions);
  };

  const OptionComponent = ({
    option,
    index,
  }: {
    option: { text: string };
    index: number;
  }) => {
    const renderedOption = useMemo(() => {
      return (
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{ALPHABET[index]})</h3>
          <div
            className="block flex-1"
            dangerouslySetInnerHTML={{ __html: option.text }}
          />
        </div>
      );
    }, [option.text, index]);

    return renderedOption;
  };

  return (
    <Draggable key={option.id} draggableId={option.id} index={index}>
      {(provided: DraggableProvided) => (
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={openAccordion as any}
          onValueChange={setOpenAccordion as any}
        >
          <AccordionItem
            value={option.id}
            ref={provided.innerRef}
            {...provided.draggableProps}
            className="overflow-hidden border-none"
          >
            <AccordionTrigger
              className={cn(
                triggerClassName,
                "rounded-t-lg pb-2 [&[data-state=open]]:rounded-b-none",
              )}
            >
              <div className="mr-2" {...provided.dragHandleProps}>
                <RiDraggable className="h-5 w-5 text-gray-400" />
              </div>
              <div className="mr-2 flex w-full items-center justify-between">
                {option.text && (
                  <OptionComponent option={option} index={index} />
                )}
                {error?.text?.message && (
                  <p className="block w-full">{error?.text?.message}</p>
                )}
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleCorrect();
                  }}
                  className="ml-2 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-primary/10"
                >
                  {option.isCorrect ? (
                    <Check className="h-4 w-4 min-w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 min-w-4 text-red-500" />
                  )}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="rounded-b-lg bg-zinc-100/10 px-4 py-4 data-[state=closed]:hidden">
              <div className="flex flex-col items-end justify-center gap-2">
                <RichText content={newText} onChange={setNewText} />
                <div className="mt-2 flex gap-2">
                  <Button
                    onClick={handleDeleteOption}
                    size="sm"
                    variant="destructive"
                    type={"button"}
                  >
                    Excluir
                  </Button>
                  <Button onClick={handleTextChange} size="sm" type={"button"}>
                    Salvar
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </Draggable>
  );
}

export default FormOptionCard;
