"use client";
import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
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
import { usePathname } from "next/navigation";
import { removeModule } from "@/app/_services/https/module-service/moduleService";
import { IoFolderOutline } from "react-icons/io5";
import Link from "next/link";

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
  const [deletingModule, setDeletingModule] = useState(false);
  const [openDeletingModule, setOpenDeletingModule] = useState(false);
  const pathname = usePathname();

  const handleDeleteModule = async () => {
    setDeletingModule(true);

    try {
      await removeModule(module.id);
      toast("Modulo excluído com sucesso");
    } catch (error) {
      console.log(error);
      toast("Erro ao excluír módulo");
    } finally {
      setDeletingModule(true);
    }
  };

  return (
    <Dialog open={openDeletingModule} onOpenChange={setOpenDeletingModule}>
      <Link href={`${pathname}/${module.id}`}>
        <div
          key={module.id}
          className={`${styles.glassEffect} group relative flex cursor-pointer items-center gap-2 rounded-lg p-4 shadow-lg transition-all duration-200 hover:scale-105`}
        >
          <div className="text-center">
            <IoFolderOutline className="text-2xl" />
          </div>
          <div>
            <p className="line-clamp-1 w-full text-base font-semibold">
              {module.name}
            </p>
            <p className="line-clamp-1 w-full text-[12px]">
              {module.description} desx qwf qwfqw fqw fqw fqw fqw fqwf qwf qwf
              qwf qwf qwf qwf qwf qwf qwf qwf
            </p>
          </div>

          <DialogTrigger
            asChild
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <button
              className="absolute right-2 top-2 hidden p-1 text-foreground opacity-50 transition-transform duration-200 hover:scale-110 hover:opacity-100 group-hover:block"
              onClick={(e) => {
                setOpenDeletingModule(true);
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <FiTrash2 className="text-base" />
            </button>
          </DialogTrigger>
        </div>
      </Link>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Tem certeza que deseja excluír o modulo &quot;{module.name}
            &quot; ?
          </DialogTitle>
          <DialogDescription>
            Essa ação é irreversível. Ao excluír o modulo, todas as questões e sessões
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
            onClick={handleDeleteModule}
            type="button"
            variant="destructive"
            className="mb-2 mt-2 w-full sm:mb-0 sm:mt-0 sm:w-[95px]"
          >
            {deletingModule ? (
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
