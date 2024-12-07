"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { useSession } from "next-auth/react";
import { FiPlusCircle } from "react-icons/fi";
import ModuleForm from "../ModuleForm";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import QuestionForm from "../QuestionForm";

interface AddModuleOrQuestionDialogProps {
  moduleId: string | null;
  userSubjects: {
    id: string;
    name: string;
    userId: string;
  }[];
}

function AddModuleOrQuestionDialog({
  moduleId,
  userSubjects,
}: AddModuleOrQuestionDialogProps) {
  const { data } = useSession();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("module");

  return (
    <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
      <Tabs
        defaultValue="module"
        className="w-[400px]"
        onValueChange={setActiveTab}
      >
        <DialogTrigger asChild>
          <Button>
            <FiPlusCircle />
            Adicionar
          </Button>
        </DialogTrigger>

        <DialogContent
          className={`max-h-[80vh] overflow-x-auto pt-10 sm:max-w-[425px] ${
            activeTab === "question" ? "sm:max-w-[600px]" : ""
          }`}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="module">Modulo</TabsTrigger>
            <TabsTrigger value="question">Questão</TabsTrigger>
          </TabsList>

          <TabsContent value="module">
            <ModuleForm
              data={data}
              setIsOpenDialog={setIsOpenDialog}
              moduleId={moduleId}
            />
          </TabsContent>

          <TabsContent value="question">
            <QuestionForm
              data={data}
              setIsOpenDialog={setIsOpenDialog}
              userSubjects={userSubjects}
              moduleId={moduleId ?? ""}
            />
          </TabsContent>
        </DialogContent>
      </Tabs>
    </Dialog>
  );
}

export default AddModuleOrQuestionDialog;
