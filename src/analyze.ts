import { deepSeek } from "./deepseek.ts";
import process from "node:process";
import dotenv from "dotenv";

dotenv.config();

export async function analyzeData(text: string) {
  const model: string = process.env.DEEPSEEK_MODEL || "";
  if (model === "") {
    throw new Error("Completion content is null");
  }
  try {
    console.log(`Running AI model ${process.env.DEEPSEEK_MODEL}`);
    const completion = await deepSeek.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "Analyze this text for sentiment, key topics, and named entities.",
        },
        { role: "user", content: text },
      ],
      temperature: 0.1,
      max_tokens: 256,
    });
    const content = completion.choices[0].message.content;
    if (content === null) {
      throw new Error("Completion content is null");
    }
    return JSON.parse(content);
  } catch (error: any) {
    console.error("Analysis error:", error.message);
    throw error;
  }
}
