"use server";

import OpenAI from "openai";

import dotenv from "dotenv";
dotenv.config();

console.log(process.env.OPENAI_API_KEY)

if (!process.env.OPENAI_API_KEY) {
  throw new Error("A chave da API do OpenAI não foi encontrada no arquivo .env");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const callOpenAI = async (prompt: string) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        { role: "user", content: prompt },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Erro ao chamar a API do OpenAI:", error);
    throw new Error(
      error instanceof Error ? error.message : "Ocorreu um erro inesperado."
    );
  }
};
