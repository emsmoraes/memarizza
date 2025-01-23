"use client";
import React, { useTransition } from "react";
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
import { useRouter } from "next/navigation";
import { deleteModuleSession } from "@/app/_services/https/module-session-service/moduleSessionService";
import { Prisma } from "@prisma/client";
import { IoPlayCircleSharp } from "react-icons/io5";
import moment from "moment";
import { Progress } from "@/app/_components/ui/progress";

interface ModuleSessionCardProps {
  session: Prisma.ModuleSessionGetPayload<{
    include: {
      moduleSessionModules: {
        include: {
          module: true;
        };
      };
    };
  }>;
}

function ModuleSessionCard({ session }: ModuleSessionCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleNavigate = () => {
    router.push(`sessions/${session.id}`);
  };

  const handleDeleteModuleSession = () => {
    startTransition(async () => {
      try {
        await deleteModuleSession(session.id);
        toast("Sessão de estudo excluída com sucesso");
      } catch (error) {
        console.log(error);
        toast("Erro ao excluír sessão de estudo");
      }
    });
  };

  const parentModule = session.moduleSessionModules[0].module;
  const modulesCount = session.moduleSessionModules.length - 1;

  return (
    <Dialog>
      <div onClick={handleNavigate}>
        <div
          key={module.id}
          className={`${styles.glassEffect} group relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg p-4 shadow-lg transition-all duration-200 hover:scale-105`}
        >
          <div className="text-center">
            <IoPlayCircleSharp className="text-5xl transition-transform duration-200 hover:scale-110" />
          </div>
          <div className="mt-2">
            <p className="w-full truncate text-center text-base font-semibold">
              {parentModule.name} {modulesCount > 0 && `+${modulesCount}`}
            </p>
            <p className="mt-1 line-clamp-2 w-full text-center text-xs">
              Criado em {moment(session.createdAt).format("DD/MM/YYYY")}
            </p>
            <div className="mt-4">
              <Progress value={session.progress} />
              <p className="mt-2 line-clamp-2 w-full text-center text-xs">
                {Number(session.progress).toFixed(2)}%
              </p>
            </div>
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
          <DialogTitle>Tem certeza que deseja essa seção?</DialogTitle>
          <DialogDescription>
            Essa ação é irreversível. Ao excluír o a sessão, você não poderá
            continuar de onde parou, caso não tenha concluído a sessão
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            onClick={handleDeleteModuleSession}
            type="button"
            variant="destructive"
            className="mb-2 mt-2 w-full sm:mb-0 sm:mt-0 sm:w-[95px]"
          >
            {isPending ? (
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

export default ModuleSessionCard;
