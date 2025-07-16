import OpenAI from 'openai';
import process from 'node:process';
import dotenv from 'dotenv';
import sharp from 'sharp';
import { pipeline } from '@xenova/transformers';
import { LMStudioClient } from '@lmstudio/sdk';
// import ollama from 'ollama';

// const message = { role: 'user', content: 'Why is the sky blue?' };
// const response = await ollama.chat({
//   model: 'llama3.2:1b-instruct-q2_K',
//   messages: [message],
//   stream: true,
// });
// for await (const part of response) {
//   process.stdout.write(part.message.content);
// }
import fs from 'node:fs';
dotenv.config();

// Create an instance of ChatOpenAI with your custom configuration
export const llm = new OpenAI({
  baseURL: process.env.LLAMA_LOCAL_BASE_URL,
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export const lmStudioClient = new LMStudioClient();

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

export async function chatWithLlmByModel(model: string, message: string) {
  try {
    // Load the model
    console.log(`Loading LLama model ${model}...`);
    const loadedModel = await lmStudioClient.llm.model(model);
    const result = await loadedModel.respond(message);

    return result.content;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}
// export async function chatWithOLlamaByModel(model: string, message: string) {
//   try {
//     // Load the model
//     console.log(`Loading LLama model ${model}...`);
//     const messages = { role: 'user', content: message };
//     const response = await ollama.chat({
//       model: 'llama3.1',
//       messages: [messages],
//       stream: true,
//     });
//     for await (const part of response) {
//       process.stdout.write(part.message.content);
//     }
//     return response;
//   } catch (error) {
//     console.error('Error processing image:', error);
//     throw error;
//   }
// }
