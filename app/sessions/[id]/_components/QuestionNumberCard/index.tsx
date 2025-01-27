import { Button } from "@/app/_components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import { IoCheckmarkCircle } from "react-icons/io5";

interface QuestionNumberCardProps {
  position: number;
  id: string;
  isActive: boolean;
  onClick: (id: string) => void;
  currentAnswer: string[];
}

function QuestionNumberCard({
  id,
  position,
  isActive,
  onClick,
  currentAnswer,
}: QuestionNumberCardProps) {
  const validAnswer = currentAnswer.filter((answer) => answer !== "");
  console.log(validAnswer)
  return (
    <Button
      onClick={() => onClick(id)}
      className={cn(
        "relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full duration-100",
        "bg-card-foreground/10 text-white hover:bg-card-foreground/20",
        isActive && "bg-blue-500 text-white hover:bg-blue-500/90",
      )}
    >
      {position}
      {validAnswer.length > 0 && (
        <IoCheckmarkCircle className="absolute -bottom-1 -right-1 text-xl text-green-500" />
      )}
    </Button>
  );
}

export default QuestionNumberCard;
