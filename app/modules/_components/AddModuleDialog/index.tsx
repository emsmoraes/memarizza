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

function AddModuleDialog() {
  const { data } = useSession();
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  return (
    <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
      <DialogTrigger asChild>
        <Button>
          <FiPlusCircle />
          Adicionar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <ModuleForm data={data} setIsOpenDialog={setIsOpenDialog} />
      </DialogContent>
    </Dialog>
  );
}

export default AddModuleDialog;
