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
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { usePathname, useRouter } from "next/navigation";
import { removeModule } from "@/app/_services/https/module-service/moduleService";

interface ModuleCardProps {
  module: {
    id: string;
    name: string;
    description: string | null;
    userId: string;
    parentId: string | null;
  };
}

function ModuleCard({ module }: ModuleCardProps) {
  const [deletingSubject, setDeletingSubject] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = () => {
    router.push(`${pathname}/${module.id}`);
  };

  const handleDeleteSubject = async () => {
    setDeletingSubject(true);

    try {
      await removeModule(module.id);
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
      <div onClick={handleNavigate}>
        <div
          key={module.id}
          className={`${styles.glassEffect} group relative flex aspect-square flex-col items-center justify-center rounded-lg p-4 shadow-lg transition-all duration-200 hover:scale-105`}
        >
          <div className="text-center">
            <FiBook className="text-2xl" />
          </div>
          <div className="mt-2">
            <p className="w-full truncate text-center text-base font-semibold">
              {module.name}
            </p>
            <p className="line-clamp-2 w-full text-center text-sm">
              {module.description}
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
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Tem certeza que deseja excluír o modulo &quot;{module.name}
            &quot; ?
          </DialogTitle>
          <DialogDescription>
            Essa ação é irreversível. Ao excluír o modulo, todas as questão
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

export default ModuleCard;
