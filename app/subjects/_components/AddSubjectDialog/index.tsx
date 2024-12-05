/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
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
import { useSession } from "next-auth/react";
import { addSubject } from "../../_actions/addSubject";
import { FiPlusCircle } from "react-icons/fi";
import { toast } from "sonner";

const formSchema = z.object({
  subjectName: z
    .string()
    .trim()
    .min(2, "O nome da disciplina deve ter pelo menos 2 caracteres."),
});

function AddSubjectDialog() {
  const { data } = useSession();
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectName: "",
    },
  });

  const handleSubmit = async (formData: z.infer<typeof formSchema>) => {
    if (data && data.user) {
      try {
        addSubject(formData.subjectName, (data.user as any).id);
        toast("Disciplina adicionada com sucesso!");
        setIsOpenDialog(false);
        form.reset();
      } catch {
        toast("Erro ao adicionar. Tente novamente mais tarde");
      }
    }
  };

  return (
    <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
      <DialogTrigger asChild>
        <Button>
          <FiPlusCircle />
          Adicionar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar disciplina</DialogTitle>
          <DialogDescription>
            Adicione uma disciplina. Não se preocupe, você pode fazer isso mais
            tarde.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="subjectName"
              render={({ field }) => (
                <FormItem className="mb-4 w-full">
                  <FormControl>
                    <Input
                      className={`font-inter rounded-[4px] border-gray-300 text-sm font-[400] text-gray-300 focus:border-gray-600 focus:text-gray-600 ${
                        field.value.trim() && "border-gray-600 text-gray-600"
                      }`}
                      placeholder="Nome da disciplina"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Adicionar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddSubjectDialog;
