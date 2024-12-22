import { PrismaClient } from "@prisma/client";
import readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

const createOptionsForQuestion = async (questionId: string) => {
  const optionsData = [
    { text: "Option 1", description: "Description for option 1", isCorrect: false },
    { text: "Option 2", description: "Description for option 2", isCorrect: false },
    { text: "Option 3", description: "Description for option 3", isCorrect: true },
    { text: "Option 4", description: "Description for option 4", isCorrect: false },
  ];

  for (const option of optionsData) {
    await prisma.option.create({
      data: {
        questionId,
        text: option.text,
        description: option.description,
        isCorrect: option.isCorrect,
      },
    });
  }
};

const createQuestions = async (numQuestions: number, moduleId: string): Promise<void> => {
  try {
    for (let i = 1; i <= numQuestions; i++) {
      const question = await prisma.question.create({
        data: {
          text: `Question ${i}`,
          public: true,
          type: "SINGLE_CHOICE",
          moduleId,
        },
      });

      console.log(`Created: ${question.text}`);
      await createOptionsForQuestion(question.id);
      console.log(`Options created for: ${question.text}`);
    }

    console.log(`${numQuestions} questions created successfully!`);
  } catch (error) {
    console.error("Error creating questions:", error);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
};

const main = async () => {
  try {
    const moduleId = await askQuestion("Enter the module ID: ");
    if (!moduleId) {
      console.log("Module ID cannot be empty. Please try again.");
      rl.close();
      return;
    }

    const numQuestionsInput = await askQuestion("How many questions do you want to create? ");
    const numQuestions = parseInt(numQuestionsInput, 10);
    if (isNaN(numQuestions) || numQuestions <= 0) {
      console.log("Invalid number. Please try again.");
      rl.close();
      return;
    }

    await createQuestions(numQuestions, moduleId);
  } catch (error) {
    console.error("Error:", error);
    rl.close();
  }
};

main();
