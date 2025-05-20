"use client";
import React, { useState } from "react";
import { LuSettings } from "react-icons/lu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import { Separator } from "@/app/_components/ui/separator";
import { Switch } from "@/app/_components/ui/switch";
import { Button } from "@/app/_components/ui/button";
import { TbEraser } from "react-icons/tb";

interface SessionConfigProps {
  toggleAllReveal: (reveal: boolean) => void;
  allRevealed: boolean;
  clearAllAnswers: () => void;
}

function SessionConfig({
  toggleAllReveal,
  allRevealed,
  clearAllAnswers,
}: SessionConfigProps) {
  const [isRevealAll, setIsRevealAll] = useState(allRevealed);
  const [isClearAll, setIsClearAll] = useState(false);

  const saveConfig = () => {
    toggleAllReveal(isRevealAll);

    if (isClearAll) {
      clearAllAnswers();
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="hover:text-secondary-light flex h-full items-center justify-center gap-2 rounded-2xl bg-foreground p-4 px-4 font-medium text-secondary transition duration-300 hover:bg-foreground/90 disabled:bg-foreground/60">
          <LuSettings size={25} />
        </button>
      </SheetTrigger>

      <SheetContent className="flex flex-col rounded-l-lg px-0">
        <SheetHeader className="px-5">
          <SheetTitle>Configurar sessão</SheetTitle>
          <SheetDescription>
            As configurações valem apenas enquanto você estiver nesta página.
            Assim que você sair, tudo será resetado! 😊
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-5" />
        <div className="flex flex-1 flex-col gap-2 px-5">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Revelar todas</span>
            <Switch onCheckedChange={setIsRevealAll} checked={isRevealAll} />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Limpar respostas</span>
            <Button
              size={"icon"}
              className="[&_svg]:size-5"
              variant={isClearAll ? "default" : "outline"}
              onClick={() => setIsClearAll((old) => !old)}
            >
              <TbEraser />
            </Button>
          </div>
        </div>
        <div className="px-2">
          <SheetClose asChild>
            <Button className="w-full" onClick={saveConfig}>
              Salvar configiração
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default SessionConfig;
