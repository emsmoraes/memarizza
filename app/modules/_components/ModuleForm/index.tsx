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
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "sonner";
import { Textarea } from "@/app/_components/ui/textarea";
import { Session } from "next-auth";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { addModule } from "@/app/_services/https/module-service/moduleService";

const formSchema = z.object({
  moduleName: z
    .string()
    .trim()
    .min(2, "O nome do módulo deve ter pelo menos 2 caracteres."),
  moduleDescription: z.string().optional(),
});

interface ModuleFormProps {
  data: Session | null;
  setIsOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  moduleId?: string | null;
}

function ModuleForm({ data, setIsOpenDialog, moduleId }: ModuleFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      moduleName: "",
      moduleDescription: "",
    },
  });

  const handleSubmit = async (formData: z.infer<typeof formSchema>) => {
    if (data && data.user) {
      startTransition(async () => {
        try {
          await addModule(
            formData.moduleName,
            formData.moduleDescription,
            data.user.id,
            moduleId,
          );
          setIsOpenDialog((old) => {
            console.log(!old);
            return !old;
          });
          toast("Módulo adicionado com sucesso!");
          form.reset();
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Erro ao adicionar. Tente novamente mais tarde.";
          toast(errorMessage);
        }
      });
    }
  };

  return (
    <Form {...form}>
      <DialogHeader className="mb-3 mt-3">
        <DialogTitle>Adicionar módulo</DialogTitle>
        <DialogDescription>
          Adicione um módulo para começar seus estudos.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="moduleName"
          render={({ field }) => (
            <FormItem className="mb-4 w-full">
              <FormControl>
                <Input
                  className={`font-inter rounded-[4px] border-gray-300 text-sm font-[400] text-gray-300 focus:border-gray-600 focus:text-gray-600 ${
                    field.value.trim() && "border-gray-600 text-gray-600"
                  }`}
                  placeholder="Nome do módulo"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="moduleDescription"
          render={({ field }) => (
            <FormItem className="mb-4 w-full">
              <FormControl>
                <Textarea
                  className={`font-inter rounded-[4px] border-gray-300 text-sm font-[400] text-gray-300 focus:border-gray-600 focus:text-gray-600 ${
                    field.value?.trim() && "border-gray-600 text-gray-600"
                  }`}
                  placeholder="Descrição do módulo"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-end justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-[90px]"
          >
            {isPending ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              "Adicionar"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default ModuleForm;
