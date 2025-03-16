import OpenAI from 'openai';
import process from 'node:process';
import dotenv from 'dotenv';
import sharp from 'sharp';
import { pipeline } from '@xenova/transformers';
import fs from 'node:fs';
dotenv.config();

// Create an instance of ChatOpenAI with your custom configuration
export const llm = new OpenAI({
  baseURL: process.env.LLAMA_LOCAL_BASE_URL,
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const encodeImage = (imagePath: string): string => {
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString('base64');
};
export async function llamaImageToText(
  model: string,
  message: string,
  url: string
) {
  try {
    // Load the model
    console.log(`Loading LLama model ${model}...`);
    const imageBase64 = fs.readFileSync(url, { encoding: 'base64' });

    const response = await llm.chat.completions.create({
      model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: message,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

