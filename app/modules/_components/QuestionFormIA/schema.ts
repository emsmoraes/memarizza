import { z } from "zod";

export const formSchema = z.object({
  prompt: z
    .string()
    .min(1, "O prompt é obrigatório"),
});
