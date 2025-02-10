"use client";
import { Button } from "@/app/_components/ui/button";
import React, { useTransition } from "react";
import { FaPlay } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { createModuleSession } from "@/app/_services/https/module-session-service/moduleSessionService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface StartModuleSessionProps {
  moduleId: string;
  userId: string;
  hasSessionInModule: string | null;
}

function StartModuleSession({
  moduleId,
  userId,
  hasSessionInModule,
}: StartModuleSessionProps) {
  const [isPending, startTransition] = useTransition();
  const navigate = useRouter();

  const handleCreateModuleSession = () => {
    if (hasSessionInModule) {
      return navigate.push(`/sessions/${hasSessionInModule}`);
    }
    startTransition(async () => {
      try {
        const createdSession = await createModuleSession(userId, moduleId);
        toast("Sessão criada com sucesso");
        navigate.push(`/sessions/${createdSession.id}`);
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            disabled={isPending}
            size="icon"
            className="h-12 w-12 rounded-full transition-transform duration-150 hover:scale-110"
            onClick={handleCreateModuleSession}
          >
            {isPending ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              <FaPlay size={32} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isPending ? (
            <p>Criando sessão de estudo</p>
          ) : (
            <p>Estudar esse módulo</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default StartModuleSession;
