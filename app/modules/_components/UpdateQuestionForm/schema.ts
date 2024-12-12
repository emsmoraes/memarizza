import { z } from "zod";

export const formSchema = z.object({
  questionTitle: z
    .string()
    .refine(
      (value) => {
        const valueToValidate = value
          .replace(/<[^>]+>/g, "")
          .replace(/[\r\n\t]/g, "")
          .trim()

        return valueToValidate.length >= 5
      },
      "O título precisa de no mínimo 5 caracteres",
    ),
  questionType: z.string().min(3, "Selecione uma opção"),
  questionSubject: z.string().min(1, "Selecione uma opção"),
  options: z
    .array(
      z.object({
        id: z.string().min(1, "O id da opção é obrigatório"),
        text: z
          .string()
          .refine((value) => {
            const valueToValidade = value.replace(/<(?!img)[^>]+>/g, "").trim()
            return valueToValidade.length >= 5;
          }, "O texto precisa de mais de 5 caracteres"),
        description: z.string().optional().nullable(),
        isCorrect: z.boolean(),
      }),
    )
    .min(2, "O número mínimo de opções é 2")
    .refine((options) => options.some((option) => option.isCorrect), {
      message: "Pelo menos uma opção precisa ser marcada como correta",
    }),
});