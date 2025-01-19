/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "@/app/_components/ui/button";
import { Session } from "next-auth";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { TbRobotFace } from "react-icons/tb";
import QuestionFormDefault from "../QuestionFormDefault";
import QuestionFormIA from "../QuestionFormIA";
interface QuestionFormProps {
  moduleId: string;
  data: Session | null;
  setIsOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

function QuestionForm({ data, setIsOpenDialog, moduleId }: QuestionFormProps) {
  const [creationType, setCreationType] = useState<"default" | "IA">("default");

  const toggleCreationType = () => {
    return creationType === "IA"
      ? setCreationType("default")
      : setCreationType("IA");
  };

  const tabRender = {
    default: (
      <QuestionFormDefault
        data={data}
        moduleId={moduleId}
        setIsOpenDialog={setIsOpenDialog}
      />
    ),
    IA: (
      <QuestionFormIA
        data={data}
        moduleId={moduleId}
        setIsOpenDialog={setIsOpenDialog}
      />
    ),
  };

  const renderTab = () => {
    return tabRender[creationType] || null;
  };

  return (
    <>
      <DialogHeader className="mb-3 flex">
        <Button
          variant={"outline"}
          className="mb-3"
          onClick={toggleCreationType}
        >
          <TbRobotFace />
          {creationType !== "IA" ? "Criar usando IA" : "Criar manualmente"}
        </Button>
        <div>
          <DialogTitle>
            {creationType !== "IA" ? "Adicionar questão" : "Adicionar questões"}
          </DialogTitle>
          <DialogDescription>
            {creationType !== "IA"
              ? "Adicione uma questão e comece os estudos."
              : "Use IA para adicionar varias questões de uma só vez"}
          </DialogDescription>
        </div>
      </DialogHeader>

      {renderTab()}
    </>
  );
}

export default QuestionForm;
