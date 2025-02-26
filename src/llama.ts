import OpenAI from 'openai';
import process from 'node:process';
import dotenv from 'dotenv';

dotenv.config();

// Create an instance of ChatOpenAI with your custom configuration
export const llm = new OpenAI({
  baseURL: process.env.LLAMA_LOCAL_BASE_URL,
  apiKey: process.env.DEEPSEEK_API_KEY,
});
