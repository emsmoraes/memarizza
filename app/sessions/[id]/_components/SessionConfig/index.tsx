import React from "react";
import { LuSettings } from "react-icons/lu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import { Separator } from "@/app/_components/ui/separator";
import { Switch } from "@/app/_components/ui/switch";

function SessionConfig() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="hover:text-secondary-light flex h-full items-center justify-center gap-2 rounded-2xl bg-foreground p-4 px-4 font-medium text-secondary transition duration-300 hover:bg-foreground/90 disabled:bg-foreground/60">
          <LuSettings size={25} />
        </button>
      </SheetTrigger>

      <SheetContent className="rounded-l-lg px-0">
        <SheetHeader className="px-5">
          <SheetTitle>Configurar sessão</SheetTitle>
          <SheetDescription>
            As configurações valem apenas enquanto você estiver nesta página.
            Assim que você sair, tudo será resetado! 😊
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-5" />
        <div className="flex flex-col gap-2 px-5">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Revelar todas</span>
            <Switch />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default SessionConfig;
