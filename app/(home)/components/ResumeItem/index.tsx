import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";

interface ResumeItemProps {
  nome: string;
  valor: number;
}

const traducoes: Record<string, string> = {
  modules: "Módulos",
  sessions: "Sessões",
  questions: "Questões",
  answers: "Respostas",
};

function ResumeItem({ nome, valor }: ResumeItemProps) {
  const translatedName = traducoes[nome] ?? nome;

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">{translatedName}</CardTitle>
        <CardDescription>
          Total de {translatedName.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold text-primary">{valor}</p>
      </CardContent>
    </Card>
  );
}

export default ResumeItem;
