import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import React from "react";
import { FiSave, FiLoader } from "react-icons/fi";

type SaveStatus = "saving" | "saved" | "unsaved";

interface SaveIndicatorProps {
  saveStatus: SaveStatus;
}

const SaveIndicator = ({ saveStatus }: SaveIndicatorProps) => {
  let icon;
  let tooltipText;

  switch (saveStatus) {
    case "saving":
      icon = <FiLoader size={25} className="animate-spin text-yellow-500" />;
      tooltipText = "Salvando alterações...";
      break;
    case "saved":
      icon = <FiSave size={25} className="text-green-500" />;
      tooltipText = "Alterações salvas com sucesso!";
      break;
    case "unsaved":
      icon = <FiSave size={25} className="text-red-500" />;
      tooltipText = "Alterações não salvas";
      break;
  }

  return (
    <div className="flex h-full flex-1 gap-2 rounded-2xl bg-accent-foreground/5 px-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">{icon}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SaveIndicator;
