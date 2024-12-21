import { Button } from "@/app/_components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface QuestionNumberCardProps {
  position: number;
  id: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

function QuestionNumberCard({
  id,
  position,
  isActive,
  onClick,
}: QuestionNumberCardProps) {
  return (
    <Button
      onClick={() => onClick(id)}
      className={cn(
        "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full duration-100",
        "bg-card-foreground/10 text-white hover:bg-card-foreground/20",
        isActive && "bg-blue-500 text-white hover:bg-blue-500/90",
      )}
    >
      {position}
    </Button>
  );
}

export default QuestionNumberCard;
