"use client";
import { Button } from "@/app/_components/ui/button";
import React, { useState } from "react";
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

interface StartModuleSessionProps {
  moduleId: string;
  userId: string;
}

function StartModuleSession({ moduleId, userId }: StartModuleSessionProps) {
  const [isLoadingCreatingModuleSession, setIsCreatingModuleSession] =
    useState(false);

  const handleCreateModuleSession = async () => {
    setIsCreatingModuleSession(true);
    try {
      await createModuleSession(userId, moduleId);
      toast("Sessão criada com sucesso");
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreatingModuleSession(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            disabled={isLoadingCreatingModuleSession}
            size="icon"
            className="h-12 w-12 rounded-full transition-transform duration-150 hover:scale-110"
            onClick={handleCreateModuleSession}
          >
            {isLoadingCreatingModuleSession ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              <FaPlay size={32} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isLoadingCreatingModuleSession ? (
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
