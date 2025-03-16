import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import { Buffer } from 'node:buffer';
import process from 'node:process';
import fs from 'node:fs';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined in the environment variables');
}
export const googleGenerativeAI = new GoogleGenerativeAI(apiKey);

export const generationConfig = {
  stopSequences: ['red'],
  maxOutputTokens: 200,
  temperature: 0.9,
  topP: 0.1,
  topK: 16,
};
export const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

// Converts local file information to base64
function fileToGenerativePart(path: string, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString('base64'),
      mimeType,
    },
  };
}

export async function geminiImageToText(
  model: string,
  prompt: string,
  path: string,
  fileExt: string = 'image/jpeg'
) {
  const geminiModel = googleGenerativeAI.getGenerativeModel({ model });

  const imageParts = [fileToGenerativePart(path, fileExt)];

  const generatedContent = await geminiModel.generateContent([
    prompt,
    ...imageParts,
  ]);

  console.log(generatedContent.response.text());
  return generatedContent.response.text();
}

export async function textToImage(model: string, prompt: string) {
  const gModel = googleGenerativeAI.getGenerativeModel({
    model, // 'gemini-pro-vision',
  });

  //   const imageParts = [
  // fileToGenerativePart('./uploads/downloaded.jpeg', 'image/jpeg'),
  // fileToGenerativePart('image2.jpg', 'image/jpeg'),
  //   ];

  //   const result = await gModel.generateContent([prompt, ...imageParts]);
  const result = await gModel.generateContent([prompt]);
  // For text-and-image input (multimodal)
  const { totalTokens } = await gModel.countTokens([prompt]);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  console.log(totalTokens);
  return text;
}

//   async function embedding() {
//     // For embedding, use the embedding-001 model
//     // For text-only input
//     model = genAI.getGenerativeModel({ model: "embedding-001"});

//     const text = "The brother love to help his sister."

//     const result = await model.embedContent(text);
//     const embedding = result.embedding;
//     console.log(embedding.values);
//   }
