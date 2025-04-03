import OpenAI from 'openai';
import process from 'node:process';
import * as fs from 'node:fs';
import dotenv from 'dotenv';
dotenv.config();

export const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

// Function to encode the image as Base64
const encodeImage = (imagePath: string): string => {
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString('base64');
};
export async function openAiImageToText(
  model: string,
  message: string,
  url: string,
  fileExt: string = 'image/jpeg'
) {
  const base64Image = encodeImage(url);
  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: message },
          {
            type: 'image_url',
            image_url: { url: `data:${fileExt};base64,${base64Image}` },
          },
        ],
      },
    ],
    store: true,
  });

  console.log(response.choices[0]);
  return response.choices[0];
}
export async function openAiTextToImage(model: string, message: string) {
  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'user',
        content: [{ type: 'text', text: message }],
      },
    ],
    store: true,
  });

  console.log(response.choices[0]);
  return `${response.choices[0]}`;
}
