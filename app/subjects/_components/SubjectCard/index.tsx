"use client";
import React, { useState } from "react";
import { FiBook, FiTrash2 } from "react-icons/fi";
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
import { removeSubject } from "../../_actions/removeSubject";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface SubjectCardProps {
  subject: {
    id: string;
    name: string;
    userId: string;
  };
}

function SubjectCard({ subject }: SubjectCardProps) {
  const [deletingSubject, setDeletingSubject] = useState(false);

  const handleDeleteSubject = async () => {
    setDeletingSubject(true);

    try {
      await removeSubject(subject.id);
      toast("Disciplina excluída com sucesso");
    } catch (error) {
      console.log(error);
      toast("Erro ao excluír disciplina");
    } finally {
      setDeletingSubject(true);
    }
  };

  return (
    <Dialog>
      <div
        key={subject.id}
        className={`${styles.glassEffect} group relative flex items-center rounded-lg p-4 shadow-lg transition-all duration-200 hover:scale-105`}
      >
        <div className="text-center">
          <FiBook className="text-2xl" />
        </div>
        <p className="w-full truncate text-center text-base font-semibold">
          {subject.name}
        </p>

        <DialogTrigger asChild>
          <button className="absolute right-2 top-2 hidden p-1 text-white opacity-50 transition-transform duration-200 hover:scale-110 hover:opacity-100 group-hover:block">
            <FiTrash2 className="text-base" />
          </button>
        </DialogTrigger>
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Tem certeza que deseja excluír a disciplina &quot;{subject.name}
            &quot; ?
          </DialogTitle>
          <DialogDescription>
            Essa ação é irreversível. Ao excluír a disciplina, todas as questão
            serão excluídas junto
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            onClick={handleDeleteSubject}
            type="button"
            variant="destructive"
            className="mb-2 mt-2 w-full sm:mb-0 sm:mt-0 sm:w-[95px]"
          >
            {deletingSubject ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              "Confirmar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SubjectCard;
