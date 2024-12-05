// src/types/next-auth.d.ts

import { DefaultSession } from "next-auth";

// Definir um tipo para o User com o campo `id`
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Adiciona a propriedade id
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }
}
